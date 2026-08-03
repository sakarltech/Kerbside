import prisma from "@/lib/prisma";
import { paymentService } from "@/lib/services/payment-service";
import { notificationService } from "@/lib/services/notification-service";
import { matchingService } from "@/lib/services/matching-service";
import type { Booking } from "@prisma/client";

const PLATFORM_COMMISSION_RATE = 0.15;

/**
 * BookingService handles the creation, cancellation, completion, and
 * instructor continuity logic for bookings.
 */
export class BookingService {
  /**
   * Create a new booking with payment intent.
   * Validates availability, calculates price, creates Stripe payment intent,
   * and stores the booking record.
   */
  async createBooking(
    studentId: string,
    instructorId: string,
    dateTime: Date,
    durationMinutes: number,
    lessonFormat?: string,
    notes?: string
  ): Promise<Booking> {
    // Get instructor profile with rate and Stripe account
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: instructorId },
      include: { user: true },
    });

    if (!instructor) {
      throw new Error("Instructor not found");
    }

    if (!instructor.hourlyRate) {
      throw new Error("Instructor has not set their hourly rate");
    }

    // Calculate total amount in pence (Stripe uses smallest currency unit)
    const hourlyRateInPence = Math.round(
      Number(instructor.hourlyRate) * 100
    );
    const totalAmountInPence = Math.round(
      (hourlyRateInPence * durationMinutes) / 60
    );
    const commissionInPence = Math.round(
      totalAmountInPence * PLATFORM_COMMISSION_RATE
    );

    // Create payment intent if instructor has Stripe account
    let paymentIntentId: string | null = null;
    if (instructor.stripeAccountId) {
      const result = await paymentService.createPaymentIntent(
        totalAmountInPence,
        instructor.stripeAccountId,
        {
          studentId,
          instructorId,
          bookingDuration: durationMinutes.toString(),
        }
      );
      paymentIntentId = result.paymentIntentId;
    }

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        studentId,
        instructorId,
        dateTime,
        durationMinutes,
        amount: totalAmountInPence / 100, // Store as decimal pounds
        commission: commissionInPence / 100,
        paymentIntentId,
        notes,
        status: "PENDING",
      },
    });

    return booking;
  }

  /**
   * Cancel a booking. Processes refund if payment was made.
   * If cancelled by instructor, triggers replacement search.
   */
  async cancelBooking(
    bookingId: string,
    cancelledBy: string
  ): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: true,
        instructor: { include: { user: true } },
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Process refund if payment was made
    if (booking.paymentIntentId && booking.status === "CONFIRMED") {
      await paymentService.processRefund(booking.paymentIntentId);
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // Send notification
    await notificationService.notifyBookingCancelled(
      updatedBooking,
      cancelledBy
    );

    // If instructor cancelled, trigger continuity service
    if (cancelledBy === booking.instructorId) {
      await this.findReplacementInstructor(bookingId);
    }

    return updatedBooking;
  }

  /**
   * Mark a booking as completed.
   * Note: Instructor payout is handled automatically by Stripe destination charges
   * (transfer_data.destination) when the PaymentIntent succeeds. No manual transfer needed.
   */
  async completeBooking(bookingId: string): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        instructor: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
    });

    return updatedBooking;
  }

  /**
   * Find a replacement instructor when the original instructor cancels.
   * Uses the student's preferences and original booking time to suggest alternatives.
   */
  async findReplacementInstructor(bookingId: string): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: { include: { user: true } },
        instructor: { include: { user: true } },
      },
    });

    if (!booking) {
      return;
    }

    // Get matches for the student
    const matches = await matchingService.findMatchesForStudent(
      booking.studentId,
      5
    );

    // Filter out the original instructor
    const replacements = matches.filter(
      (m) => m.instructorId !== booking.instructorId
    );

    if (replacements.length > 0) {
      const suggestions = replacements.map((r) => ({
        id: r.instructorId,
        name: r.instructorName,
      }));

      await notificationService.notifyReplacementSuggested(
        booking.studentId,
        suggestions
      );
    }
  }
}

export const bookingService = new BookingService();
