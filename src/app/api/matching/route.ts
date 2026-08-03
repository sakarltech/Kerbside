import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { matchingService } from "@/lib/services/matching-service";

/**
 * POST /api/matching
 * Run matching engine for a student. Returns ranked instructors with scores and factor breakdowns.
 * Stores results in MatchScore table for caching.
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
        { success: false, error: "Only students can run the matching engine" },
        { status: 403 }
      );
    }

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { success: false, error: "Student profile not found. Please create a profile first." },
        { status: 404 }
      );
    }

    // Parse optional body for limit override
    let limit = 10;
    try {
      const body = await request.json();
      if (body.limit && typeof body.limit === "number") {
        limit = Math.min(body.limit, 50);
      }
    } catch {
      // No body or invalid JSON is fine, use defaults
    }

    // Find matches
    const matches = await matchingService.findMatchesForStudent(
      studentProfile.id,
      limit
    );

    // Store/refresh scores in the database
    await matchingService.refreshMatchScores(studentProfile.id);

    return NextResponse.json({
      success: true,
      data: matches,
    });
  } catch (error) {
    console.error("[API] POST /api/matching error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run matching engine" },
      { status: 500 }
    );
  }
}
