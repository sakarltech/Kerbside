import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/progress
 * Get progress entries.
 * STUDENT: their own progress.
 * INSTRUCTOR: progress for their students.
 * Filter by studentId, skill_name.
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
    const studentId = searchParams.get("studentId");
    const skillName = searchParams.get("skill_name");

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
      if (studentId) {
        where.studentId = studentId;
      }
    }
    // Admin can see all, optionally filter

    if (user.role === "ADMIN" && studentId) {
      where.studentId = studentId;
    }

    if (skillName) {
      where.skillName = skillName;
    }

    const progress = await prisma.progress.findMany({
      where,
      include: {
        student: {
          include: { user: { select: { name: true } } },
        },
        instructor: {
          include: { user: { select: { name: true } } },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("[API] GET /api/progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress entries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Log progress. INSTRUCTOR only.
 * Body: studentId, skill_name, level (1-5), notes.
 * Validates instructor has/had bookings with this student.
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
    if (user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { success: false, error: "Only instructors can log progress" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const progressSchema = z.object({
      studentId: z.string(),
      skillName: z.string().min(1, "Skill name is required"),
      level: z.number().int().min(1).max(5),
      notes: z.string().optional(),
    });

    const result = progressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Get instructor profile
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!instructorProfile) {
      return NextResponse.json(
        { success: false, error: "Instructor profile not found" },
        { status: 404 }
      );
    }

    // Validate instructor has/had bookings with this student
    const hasBooking = await prisma.booking.findFirst({
      where: {
        instructorId: instructorProfile.id,
        studentId: result.data.studentId,
      },
    });

    if (!hasBooking) {
      return NextResponse.json(
        { success: false, error: "You can only log progress for students you have bookings with" },
        { status: 403 }
      );
    }

    const progress = await prisma.progress.create({
      data: {
        studentId: result.data.studentId,
        instructorId: instructorProfile.id,
        skillName: result.data.skillName,
        level: result.data.level,
        notes: result.data.notes,
      },
    });

    return NextResponse.json(
      { success: true, data: progress },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log progress" },
      { status: 500 }
    );
  }
}
