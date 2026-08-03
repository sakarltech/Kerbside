import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/students
 * List students. Admin only. Paginated.
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
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.studentProfile.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: students,
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
    console.error("[API] GET /api/students error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Create student profile. Requires authenticated STUDENT role.
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
        { success: false, error: "Only students can create student profiles" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const profileSchema = z.object({
      postcode: z.string().min(5, "Please enter a valid postcode"),
      preferredGender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
      preferredLanguage: z.string().optional(),
      preferredTeachingStyle: z.enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"]).optional(),
      preferredCarType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]).optional(),
      anxietyFriendly: z.boolean().default(false),
      preferredLessonFormat: z.enum(["HOURLY", "BLOCK_5", "BLOCK_10"]).optional(),
      pickupFlexibilityKm: z.number().min(1).max(30).default(5),
      goalTimeline: z.string().optional(),
      availabilityPattern: z.string().optional(),
    });

    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existing = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Student profile already exists" },
        { status: 409 }
      );
    }

    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        ...result.data,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/students error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create student profile" },
      { status: 500 }
    );
  }
}
