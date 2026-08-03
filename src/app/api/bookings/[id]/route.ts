import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bookingService } from "@/lib/services/booking-service";
import { z } from "zod";

/**
 * GET /api/bookings/[id]
 * Get booking details with instructor, student, and payment info.
 * Auth check: participant or admin.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        instructor: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user is a participant or admin
    const isParticipant =
      booking.student.userId === user.id ||
      booking.instructor.userId === user.id;

    if (!isParticipant && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("[API] GET /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bookings/[id]
 * Update booking status.
 * INSTRUCTOR can confirm/cancel.
 * STUDENT can cancel (if > 24h before).
 * On cancel: trigger refund. On complete: enable review.
 * On instructor cancel: trigger continuity service.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };

    const body = await request.json();
    const updateSchema = z.object({
      status: z.enum(["CONFIRMED", "CANCELLED", "COMPLETED"]),
    });

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        instructor: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const isStudent = booking.student.userId === user.id;
    const isInstructor = booking.instructor.userId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isStudent && !isInstructor && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { status: newStatus } = result.data;

    // Handle cancellation
    if (newStatus === "CANCELLED") {
      if (isStudent) {
        // Student can only cancel > 24h before
        const hoursUntilBooking =
          (booking.dateTime.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilBooking < 24) {
          return NextResponse.json(
            {
              success: false,
              error: "Cannot cancel within 24 hours of the booking",
            },
            { status: 400 }
          );
        }
      }

      const cancelledBy = isInstructor
        ? booking.instructorId
        : booking.studentId;
      const updatedBooking = await bookingService.cancelBooking(
        params.id,
        cancelledBy
      );
      return NextResponse.json({ success: true, data: updatedBooking });
    }

    // Handle confirmation (instructor only)
    if (newStatus === "CONFIRMED") {
      if (!isInstructor && !isAdmin) {
        return NextResponse.json(
          { success: false, error: "Only instructors can confirm bookings" },
          { status: 403 }
        );
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: params.id },
        data: { status: "CONFIRMED" },
      });

      return NextResponse.json({ success: true, data: updatedBooking });
    }

    // Handle completion (instructor only)
    if (newStatus === "COMPLETED") {
      if (!isInstructor && !isAdmin) {
        return NextResponse.json(
          { success: false, error: "Only instructors can mark bookings as completed" },
          { status: 403 }
        );
      }

      const updatedBooking = await bookingService.completeBooking(params.id);
      return NextResponse.json({ success: true, data: updatedBooking });
    }

    return NextResponse.json(
      { success: false, error: "Invalid status transition" },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update booking";
    console.error("[API] PUT /api/bookings/[id] error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
