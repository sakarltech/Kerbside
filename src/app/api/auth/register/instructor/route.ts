import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";

// TODO: Add rate limiting (e.g., via next-rate-limit or middleware-level rate limiting)
// before production deployment. This endpoint is unauthenticated and performs
// CPU-intensive bcrypt hashing, making it a target for resource exhaustion attacks.

const instructorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  phone: z.string().min(1, "Phone number is required"),
  adiNumber: z.string().optional(),
  yearsExperience: z.number().int().min(0).optional(),
  carType: z.string().optional(),
  transmission: z.string().optional(),
  bio: z.string().optional(),
  specialisms: z.array(z.string()).optional(),
  teachingStyle: z.string().optional(),
  languages: z.array(z.string()).optional(),
  gender: z.string().optional(),
  anxietyFriendly: z.boolean().optional(),
  postcodes: z.array(z.string()).optional(),
  hourlyRate: z.number().min(0).optional(),
});

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
    adaptive: "ADAPTIVE",
  };
  return mapping[style.toLowerCase()] || undefined;
}

/**
 * Map frontend car type strings to the Prisma CarType enum.
 */
function mapCarType(type?: string): "MANUAL" | "AUTOMATIC" | "BOTH" | undefined {
  if (!type) return undefined;
  const mapping: Record<string, "MANUAL" | "AUTOMATIC" | "BOTH"> = {
    manual: "MANUAL",
    automatic: "AUTOMATIC",
    both: "BOTH",
  };
  return mapping[type.toLowerCase()] || undefined;
}

/**
 * Map frontend gender strings to the Prisma Gender enum.
 */
function mapGender(gender?: string): "MALE" | "FEMALE" | "NO_PREFERENCE" | undefined {
  if (!gender) return undefined;
  const mapping: Record<string, "MALE" | "FEMALE" | "NO_PREFERENCE"> = {
    male: "MALE",
    female: "FEMALE",
    other: "NO_PREFERENCE",
    "prefer-not-to-say": "NO_PREFERENCE",
  };
  return mapping[gender.toLowerCase()] || undefined;
}

/**
 * POST /api/auth/register/instructor
 * Creates a new User with role INSTRUCTOR and an associated InstructorProfile
 * in a single transaction. Accepts the full registration payload from the
 * multi-step instructor registration form.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = instructorRegisterSchema.safeParse(body);

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
      phone,
      adiNumber,
      yearsExperience,
      carType,
      transmission,
      bio,
      specialisms,
      teachingStyle,
      languages,
      gender,
      anxietyFriendly,
      postcodes,
      hourlyRate,
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

    // Determine the car type for the profile - use transmission if provided,
    // otherwise fall back to carType mapping
    const profileCarType = mapCarType(transmission) || mapCarType(carType);

    // Create user and instructor profile in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: "INSTRUCTOR",
          phone,
        },
      });

      const instructorProfile = await tx.instructorProfile.create({
        data: {
          userId: user.id,
          adiNumber: adiNumber || undefined,
          bio: bio || undefined,
          specialisms: specialisms || [],
          teachingStyle: mapTeachingStyle(teachingStyle),
          languages: languages || [],
          carType: profileCarType,
          gender: mapGender(gender),
          anxietyFriendly: anxietyFriendly || false,
          coveragePostcodes: postcodes || [],
          hourlyRate: hourlyRate ? hourlyRate : undefined,
        },
      });

      return { user, instructorProfile };
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
    console.error("[API] POST /api/auth/register/instructor error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create account" },
      { status: 500 }
    );
  }
}
