import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";
import { bookingService } from "@/lib/services/booking-service";

/**
 * GET /api/bookings
 * List bookings for the authenticated user. Students see their bookings, instructors see theirs.
 * Filter by status. Paginated.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as { id: string; role: string };
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    // Build filter based on user role
    const where: Record<string, unknown> = {};

    if (user.role === "STUDENT") {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: user.id },
      });
      if (studentProfile) {
        where.studentId = studentProfile.id;
      }
    } else if (user.role === "INSTRUCTOR") {
      const instructorProfile = await prisma.instructorProfile.findUnique({
        where: { userId: user.id },
      });
      if (instructorProfile) {
        where.instructorId = instructorProfile.id;
      }
    }
    // Admin sees all bookings (no filter)

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          student: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          instructor: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
          review: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        pageSize: limit,
        totalItems: total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookings
 * Create a booking. Requires STUDENT role.
 * Body: instructorId, dateTime, durationMinutes, lessonFormat (optional), notes (optional).
 */
export async function POST(request: NextRequest) {
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
        { success: false, error: "Only students can create bookings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { success: false, error: "Student profile not found" },
        { status: 404 }
      );
    }

    const booking = await bookingService.createBooking(
      studentProfile.id,
      result.data.instructorId,
      new Date(result.data.dateTime),
      result.data.durationMinutes,
      undefined,
      result.data.notes
    );

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create booking";
    console.error("[API] POST /api/bookings error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
