import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/progress/[id]
 * Get a specific progress entry. Auth check.
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

    const progress = await prisma.progress.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: { user: { select: { id: true, name: true } } },
        },
        instructor: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });

    if (!progress) {
      return NextResponse.json(
        { success: false, error: "Progress entry not found" },
        { status: 404 }
      );
    }

    // Check auth: student who owns it, instructor who logged it, or admin
    const isOwner =
      progress.student.userId === user.id ||
      progress.instructor.userId === user.id;

    if (!isOwner && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error("[API] GET /api/progress/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress entry" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/progress/[id]
 * Update a progress entry. INSTRUCTOR only (must be the one who logged it).
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
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Only instructors can update progress entries" },
        { status: 403 }
      );
    }

    const progress = await prisma.progress.findUnique({
      where: { id: params.id },
      include: {
        instructor: true,
      },
    });

    if (!progress) {
      return NextResponse.json(
        { success: false, error: "Progress entry not found" },
        { status: 404 }
      );
    }

    // Verify instructor owns this entry
    if (progress.instructor.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "You can only update your own progress entries" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateSchema = z.object({
      skillName: z.string().min(1).optional(),
      level: z.number().int().min(1).max(5).optional(),
      notes: z.string().optional(),
    });

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const updated = await prisma.progress.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API] PUT /api/progress/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update progress entry" },
      { status: 500 }
    );
  }
}
