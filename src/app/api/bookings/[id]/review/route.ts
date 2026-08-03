import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * POST /api/bookings/[id]/review
 * Submit a review for a completed booking. STUDENT only.
 * Validates: booking is COMPLETED, no existing review, student owns booking.
 */
export async function POST(
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
    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { success: false, error: "Only students can submit reviews" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const reviewSchema = z.object({
      rating: z.number().int().min(1).max(5),
      comment: z.string().max(1000).optional(),
    });

    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Get booking with student info
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify student owns this booking
    if (booking.student.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "You can only review your own bookings" },
        { status: 403 }
      );
    }

    // Verify booking is completed
    if (booking.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Can only review completed bookings" },
        { status: 400 }
      );
    }

    // Verify no existing review
    if (booking.review) {
      return NextResponse.json(
        { success: false, error: "A review already exists for this booking" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        bookingId: params.id,
        studentId: booking.studentId,
        instructorId: booking.instructorId,
        rating: result.data.rating,
        comment: result.data.comment,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/bookings/[id]/review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
