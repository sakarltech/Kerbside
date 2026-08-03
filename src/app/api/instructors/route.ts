import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { instructorRegistrationSchema } from "@/lib/validators";
import { z } from "zod";

/**
 * GET /api/instructors
 * List instructors with optional filters. Paginated.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const postcode = searchParams.get("postcode");
    const teachingStyle = searchParams.get("teaching_style");
    const carType = searchParams.get("car_type");
    const gender = searchParams.get("gender");
    const anxietyFriendly = searchParams.get("anxiety_friendly");
    const minRate = searchParams.get("min_rate");
    const maxRate = searchParams.get("max_rate");

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (postcode) {
      where.coveragePostcodes = { has: postcode.toUpperCase() };
    }
    if (teachingStyle) {
      where.teachingStyle = teachingStyle;
    }
    if (carType) {
      where.carType = carType;
    }
    if (gender) {
      where.gender = gender;
    }
    if (anxietyFriendly === "true") {
      where.anxietyFriendly = true;
    }
    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) {
        (where.hourlyRate as Record<string, number>).gte = parseFloat(minRate);
      }
      if (maxRate) {
        (where.hourlyRate as Record<string, number>).lte = parseFloat(maxRate);
      }
    }

    const [instructors, total] = await Promise.all([
      prisma.instructorProfile.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          availability: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.instructorProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: instructors,
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
    console.error("[API] GET /api/instructors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch instructors" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/instructors
 * Create instructor profile. Requires authenticated INSTRUCTOR role.
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
        { success: false, error: "Only instructors can create instructor profiles" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate profile fields (subset of registration schema)
    const profileSchema = z.object({
      adiNumber: z.string().regex(/^\d{6}$/, "ADI number must be 6 digits").optional(),
      bio: z.string().max(500).optional(),
      specialisms: z.array(z.string()).default([]),
      teachingStyle: z.enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"]).optional(),
      languages: z.array(z.string()).min(1, "At least one language is required"),
      carType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]),
      gender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
      anxietyFriendly: z.boolean().default(false),
      hourlyRate: z.number().min(20).max(100),
      coveragePostcodes: z.array(z.string()).min(1, "At least one coverage postcode is required"),
    });

    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existing = await prisma.instructorProfile.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Instructor profile already exists" },
        { status: 409 }
      );
    }

    const profile = await prisma.instructorProfile.create({
      data: {
        userId: user.id,
        adiNumber: result.data.adiNumber,
        bio: result.data.bio,
        specialisms: result.data.specialisms,
        teachingStyle: result.data.teachingStyle,
        languages: result.data.languages,
        carType: result.data.carType,
        gender: result.data.gender,
        anxietyFriendly: result.data.anxietyFriendly,
        hourlyRate: result.data.hourlyRate,
        coveragePostcodes: result.data.coveragePostcodes,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/instructors error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create instructor profile" },
      { status: 500 }
    );
  }
}
