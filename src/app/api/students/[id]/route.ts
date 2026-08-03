import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/students/[id]
 * Get student profile with preferences. Auth check: own profile or admin.
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

    const student = await prisma.studentProfile.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    // Check ownership or admin
    if (student.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("[API] GET /api/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/students/[id]
 * Update student preferences. Auth check: own profile.
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

    const student = await prisma.studentProfile.findUnique({
      where: { id: params.id },
    });

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateSchema = z.object({
      postcode: z.string().min(5).optional(),
      preferredGender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
      preferredLanguage: z.string().optional(),
      preferredTeachingStyle: z.enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"]).optional(),
      preferredCarType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]).optional(),
      anxietyFriendly: z.boolean().optional(),
      preferredLessonFormat: z.enum(["HOURLY", "BLOCK_5", "BLOCK_10"]).optional(),
      pickupFlexibilityKm: z.number().min(1).max(30).optional(),
      goalTimeline: z.string().optional(),
      availabilityPattern: z.string().optional(),
    });

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.studentProfile.update({
      where: { id: params.id },
      data: result.data,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API] PUT /api/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update student" },
      { status: 500 }
    );
  }
}
