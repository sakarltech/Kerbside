import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/instructors/[id]
 * Get single instructor with profile, reviews, and average rating.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        availability: true,
        reviews: {
          include: {
            student: {
              include: {
                user: { select: { name: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating =
      instructor.reviews.length > 0
        ? instructor.reviews.reduce((sum, r) => sum + r.rating, 0) /
          instructor.reviews.length
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...instructor,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: instructor.reviews.length,
      },
    });
  } catch (error) {
    console.error("[API] GET /api/instructors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch instructor" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/instructors/[id]
 * Update instructor profile. Auth check: own profile or admin.
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

    // Check ownership or admin
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    if (instructor.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateSchema = z.object({
      bio: z.string().max(500).optional(),
      specialisms: z.array(z.string()).optional(),
      teachingStyle: z.enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"]).optional(),
      languages: z.array(z.string()).optional(),
      carType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]).optional(),
      gender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
      anxietyFriendly: z.boolean().optional(),
      hourlyRate: z.number().min(20).max(100).optional(),
      coveragePostcodes: z.array(z.string()).optional(),
      profilePhoto: z.string().optional(),
    });

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.instructorProfile.update({
      where: { id: params.id },
      data: result.data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API] PUT /api/instructors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update instructor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/instructors/[id]
 * Soft-delete/deactivate instructor. Admin only.
 */
export async function DELETE(
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
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting adiVerified to false (deactivation)
    await prisma.instructorProfile.update({
      where: { id: params.id },
      data: { adiVerified: false },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Instructor deactivated successfully" },
    });
  } catch (error) {
    console.error("[API] DELETE /api/instructors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate instructor" },
      { status: 500 }
    );
  }
}
