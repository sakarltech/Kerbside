import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { paymentService } from "@/lib/services/payment-service";

/**
 * POST /api/payments/connect
 * Create or get Stripe Connect account link for instructor onboarding.
 * Auth check: INSTRUCTOR role required.
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

    const user = session.user as { id: string; role: string; email: string };
    if (user.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { success: false, error: "Only instructors can onboard to Stripe Connect" },
        { status: 403 }
      );
    }

    // Get instructor profile
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: user.id },
      include: { user: true },
    });

    if (!instructorProfile) {
      return NextResponse.json(
        { success: false, error: "Instructor profile not found" },
        { status: 404 }
      );
    }

    // Create or get the Stripe Connect account
    const accountId = await paymentService.createOrGetConnectAccount(
      instructorProfile.id,
      instructorProfile.user.email
    );

    // Generate account link for onboarding
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const returnUrl = `${baseUrl}/dashboard/instructor/payments`;
    const url = await paymentService.getAccountLink(accountId, returnUrl);

    return NextResponse.json({
      success: true,
      data: {
        accountId,
        onboardingUrl: url,
      },
    });
  } catch (error) {
    console.error("[API] POST /api/payments/connect error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create Stripe Connect link" },
      { status: 500 }
    );
  }
}
