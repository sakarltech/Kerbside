import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/admin/instructors
 * List instructors pending ADI verification. Admin only.
 * Returns unverified profiles.
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

    const unverifiedInstructors = await prisma.instructorProfile.findMany({
      where: {
        adiVerified: false,
        adiNumber: { not: null },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: unverifiedInstructors,
    });
  } catch (error) {
    console.error("[API] GET /api/admin/instructors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pending verifications" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/instructors
 * Approve or reject ADI verification. Admin only.
 * Body: instructorId, action (approve/reject), reason (for reject).
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();

    const verificationSchema = z.object({
      instructorId: z.string(),
      action: z.enum(["approve", "reject"]),
      reason: z.string().optional(),
    });

    const result = verificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    const { instructorId, action, reason } = result.data;

    const instructor = await prisma.instructorProfile.findUnique({
      where: { id: instructorId },
    });

    if (!instructor) {
      return NextResponse.json(
        { success: false, error: "Instructor not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      await prisma.instructorProfile.update({
        where: { id: instructorId },
        data: { adiVerified: true },
      });

      return NextResponse.json({
        success: true,
        data: { message: "Instructor ADI verification approved" },
      });
    } else {
      // Reject - clear the ADI number so they can resubmit
      await prisma.instructorProfile.update({
        where: { id: instructorId },
        data: { adiNumber: null, adiVerified: false },
      });

      return NextResponse.json({
        success: true,
        data: {
          message: "Instructor ADI verification rejected",
          reason: reason || "No reason provided",
        },
      });
    }
  } catch (error) {
    console.error("[API] PUT /api/admin/instructors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process verification" },
      { status: 500 }
    );
  }
}
