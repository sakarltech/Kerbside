import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";

// TODO: Add rate limiting (e.g., via next-rate-limit or middleware-level rate limiting)
// before production deployment. This endpoint is unauthenticated and performs
// CPU-intensive bcrypt hashing, making it a target for resource exhaustion attacks.

const studentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  postcode: z.string().optional(),
  preferredGender: z.string().optional(),
  language: z.string().optional(),
  teachingStyle: z.string().optional(),
  carType: z.string().optional(),
  anxietyFriendly: z.boolean().optional(),
  lessonFormat: z.string().optional(),
  pickupFlexibility: z.string().optional(),
  goalTimeline: z.string().optional(),
});

/**
 * Map frontend gender preference strings to the Prisma Gender enum.
 */
function mapGender(gender?: string): "MALE" | "FEMALE" | "NO_PREFERENCE" | undefined {
  if (!gender) return undefined;
  const mapping: Record<string, "MALE" | "FEMALE" | "NO_PREFERENCE"> = {
    male: "MALE",
    female: "FEMALE",
    "no-preference": "NO_PREFERENCE",
  };
  return mapping[gender.toLowerCase()] || undefined;
}

/**
 * Map frontend teaching style strings to the Prisma TeachingStyle enum.
 */
function mapTeachingStyle(
  style?: string
): "PATIENT" | "INTENSIVE" | "STRUCTURED" | "RELAXED" | "ADAPTIVE" | undefined {
  if (!style) return undefined;
  const mapping: Record<string, "PATIENT" | "INTENSIVE" | "STRUCTURED" | "RELAXED" | "ADAPTIVE"> = {
    patient: "PATIENT",
    structured: "STRUCTURED",
    friendly: "RELAXED",
    focused: "INTENSIVE",
    "no-preference": "ADAPTIVE",
  };
  return mapping[style.toLowerCase()] || undefined;
}

/**
 * Map frontend car type strings to the Prisma CarType enum.
 */
function mapCarType(type?: string): "MANUAL" | "AUTOMATIC" | "BOTH" | undefined {
  if (!type) return undefined;
  const mapping: Record<string, "MANUAL" | "AUTOMATIC" | "BOTH"> = {
    hatchback: "MANUAL",
    sedan: "AUTOMATIC",
    suv: "AUTOMATIC",
    "no-preference": "BOTH",
  };
  return mapping[type.toLowerCase()] || undefined;
}

/**
 * Map frontend lesson format strings to the Prisma LessonFormat enum.
 */
function mapLessonFormat(format?: string): "HOURLY" | "BLOCK_5" | "BLOCK_10" | undefined {
  if (!format) return undefined;
  const mapping: Record<string, "HOURLY" | "BLOCK_5" | "BLOCK_10"> = {
    weekly: "HOURLY",
    intensive: "BLOCK_10",
    flexible: "BLOCK_5",
  };
  return mapping[format.toLowerCase()] || undefined;
}

/**
 * Map frontend pickup flexibility strings to a numeric km value.
 */
function mapPickupFlexibility(flexibility?: string): number {
  if (!flexibility) return 5;
  const mapping: Record<string, number> = {
    "home-only": 1,
    flexible: 5,
    anywhere: 15,
  };
  return mapping[flexibility.toLowerCase()] || 5;
}

/**
 * POST /api/auth/register/student
 * Creates a new User with role STUDENT and an associated StudentProfile
 * in a single transaction. Accepts the full registration payload from the
 * student registration form.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = studentRegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      postcode,
      preferredGender,
      language,
      teachingStyle,
      carType,
      anxietyFriendly,
      lessonFormat,
      pickupFlexibility,
      goalTimeline,
    } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Return generic success to prevent email enumeration.
      // The user will discover the conflict when they try to sign in.
      return NextResponse.json(
        {
          success: true,
          message: "Registration successful. Please sign in to continue.",
        },
        { status: 201 }
      );
    }

    // Hash the password with bcrypt cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user and student profile in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "STUDENT",
        },
      });

      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          postcode: postcode || undefined,
          preferredGender: mapGender(preferredGender),
          preferredLanguage: language || undefined,
          preferredTeachingStyle: mapTeachingStyle(teachingStyle),
          preferredCarType: mapCarType(carType),
          anxietyFriendly: anxietyFriendly || false,
          preferredLessonFormat: mapLessonFormat(lessonFormat),
          pickupFlexibilityKm: mapPickupFlexibility(pickupFlexibility),
          goalTimeline: goalTimeline || undefined,
        },
      });

      return { user, studentProfile };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please sign in to continue.",
        data: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/auth/register/student error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
