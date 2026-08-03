import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { availabilitySchema } from "@/lib/validators";
import { z } from "zod";

/**
 * GET /api/instructors/[id]/availability
 * Get instructor's availability slots with optional date range filter.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    const where: Record<string, unknown> = { instructorId: params.id };

    if (startDate || endDate) {
      where.specificDate = {};
      if (startDate) {
        (where.specificDate as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.specificDate as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const availability = await prisma.availability.findMany({
      where,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error("[API] GET /api/instructors/[id]/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instructors/[id]/availability
 * Add an availability slot. Auth check: own profile.
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

    // Verify ownership
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
    });

    if (!instructor || instructor.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = availabilitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const slot = await prisma.availability.create({
      data: {
        instructorId: params.id,
        dayOfWeek: result.data.dayOfWeek,
        startTime: result.data.startTime,
        endTime: result.data.endTime,
        isRecurring: result.data.isRecurring,
        specificDate: result.data.specificDate
          ? new Date(result.data.specificDate)
          : null,
      },
    });

    return NextResponse.json({ success: true, data: slot }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/instructors/[id]/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create availability slot" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/instructors/[id]/availability
 * Update an availability slot by slotId (passed in body). Auth check.
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

    // Verify ownership
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
    });

    if (!instructor || instructor.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const updateSchema = z.object({
      slotId: z.string(),
      dayOfWeek: z.number().int().min(0).max(6).optional(),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
      isRecurring: z.boolean().optional(),
      specificDate: z.string().datetime().optional(),
    });

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const { slotId, ...updateData } = result.data;

    // Verify slot belongs to this instructor
    const slot = await prisma.availability.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.instructorId !== params.id) {
      return NextResponse.json(
        { success: false, error: "Slot not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.availability.update({
      where: { id: slotId },
      data: {
        ...updateData,
        specificDate: updateData.specificDate
          ? new Date(updateData.specificDate)
          : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[API] PUT /api/instructors/[id]/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update availability slot" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/instructors/[id]/availability
 * Remove an availability slot by slotId (query param). Auth check.
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

    // Verify ownership
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: params.id },
    });

    if (!instructor || instructor.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get("slotId");

    if (!slotId) {
      return NextResponse.json(
        { success: false, error: "slotId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify slot belongs to this instructor
    const slot = await prisma.availability.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.instructorId !== params.id) {
      return NextResponse.json(
        { success: false, error: "Slot not found" },
        { status: 404 }
      );
    }

    await prisma.availability.delete({
      where: { id: slotId },
    });

    return NextResponse.json({
      success: true,
      data: { message: "Availability slot removed" },
    });
  } catch (error) {
    console.error("[API] DELETE /api/instructors/[id]/availability error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete availability slot" },
      { status: 500 }
    );
  }
}
