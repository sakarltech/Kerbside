import prisma from "@/lib/prisma";
import type { MatchFactors, MatchResult } from "@/types";

// Weight factors for the matching algorithm (must sum to 1.0)
const WEIGHTS = {
  location: 0.25,
  gender: 0.15,
  language: 0.15,
  style: 0.15,
  car: 0.10,
  availability: 0.10,
  anxiety: 0.05,
  specialism: 0.05,
} as const;

interface StudentPreferences {
  postcode: string | null;
  preferredGender: string | null;
  preferredLanguage: string | null;
  preferredTeachingStyle: string | null;
  preferredCarType: string | null;
  anxietyFriendly: boolean;
  availabilityPattern: string | null;
}

interface InstructorData {
  id: string;
  userId: string;
  coveragePostcodes: string[];
  gender: string | null;
  languages: string[];
  teachingStyle: string | null;
  carType: string | null;
  anxietyFriendly: boolean;
  specialisms: string[];
  availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}

/**
 * Calculate the location score based on postcode matching.
 * Exact match in coverage = 100, partial prefix match = 50, no match = 0.
 */
function calculateLocationScore(
  studentPostcode: string | null,
  instructorPostcodes: string[]
): number {
  if (!studentPostcode || instructorPostcodes.length === 0) {
    return 0;
  }

  const normalizedStudentPostcode = studentPostcode
    .replace(/\s+/g, "")
    .toUpperCase();

  // Check for exact match
  const hasExactMatch = instructorPostcodes.some(
    (pc) => pc.replace(/\s+/g, "").toUpperCase() === normalizedStudentPostcode
  );

  if (hasExactMatch) {
    return 100;
  }

  // Check for partial match (postcode area/district)
  const studentPrefix = normalizedStudentPostcode.slice(0, 3);
  const hasPartialMatch = instructorPostcodes.some((pc) => {
    const normalizedPc = pc.replace(/\s+/g, "").toUpperCase();
    return normalizedPc.startsWith(studentPrefix) || normalizedStudentPostcode.startsWith(normalizedPc.slice(0, 3));
  });

  if (hasPartialMatch) {
    return 50;
  }

  return 0;
}

/**
 * Calculate gender preference score.
 * NO_PREFERENCE always matches. Exact match = 100, mismatch = 0.
 */
function calculateGenderScore(
  preferredGender: string | null,
  instructorGender: string | null
): number {
  if (!preferredGender || preferredGender === "NO_PREFERENCE") {
    return 100;
  }

  if (!instructorGender) {
    return 50;
  }

  return preferredGender === instructorGender ? 100 : 0;
}

/**
 * Calculate language match score.
 * Checks intersection of student preferred language with instructor languages.
 */
function calculateLanguageScore(
  preferredLanguage: string | null,
  instructorLanguages: string[]
): number {
  if (!preferredLanguage || instructorLanguages.length === 0) {
    return 50; // Neutral if no preference or no data
  }

  const normalizedPreferred = preferredLanguage.toLowerCase();
  const hasMatch = instructorLanguages.some(
    (lang) => lang.toLowerCase() === normalizedPreferred
  );

  return hasMatch ? 100 : 0;
}

/**
 * Calculate teaching style compatibility score.
 * Exact match = 100, ADAPTIVE instructor style = 75, mismatch = 0.
 */
function calculateStyleScore(
  preferredStyle: string | null,
  instructorStyle: string | null
): number {
  if (!preferredStyle) {
    return 100; // No preference means any style works
  }

  if (!instructorStyle) {
    return 50;
  }

  if (preferredStyle === instructorStyle) {
    return 100;
  }

  // ADAPTIVE instructors partially match any preference
  if (instructorStyle === "ADAPTIVE") {
    return 75;
  }

  return 0;
}

/**
 * Calculate car type compatibility score.
 * BOTH always matches. Exact match = 100, mismatch = 0.
 */
function calculateCarScore(
  preferredCarType: string | null,
  instructorCarType: string | null
): number {
  if (!preferredCarType) {
    return 100;
  }

  if (!instructorCarType) {
    return 50;
  }

  if (instructorCarType === "BOTH") {
    return 100;
  }

  return preferredCarType === instructorCarType ? 100 : 0;
}

/**
 * Calculate availability overlap score.
 * Compares student availability pattern with instructor availability slots.
 */
function calculateAvailabilityScore(
  studentPattern: string | null,
  instructorAvailability: { dayOfWeek: number; startTime: string; endTime: string }[]
): number {
  if (!studentPattern || instructorAvailability.length === 0) {
    return 50; // Neutral if no data available
  }

  // If instructor has broad availability (5+ slots), high score
  if (instructorAvailability.length >= 5) {
    return 80;
  }

  // Basic availability - some slots available
  if (instructorAvailability.length >= 3) {
    return 60;
  }

  return 40;
}

/**
 * Calculate anxiety-friendly score.
 * If student needs anxiety-friendly and instructor is, score = 100.
 * If student does not need it, always 100.
 */
function calculateAnxietyScore(
  studentNeedsAnxietyFriendly: boolean,
  instructorIsAnxietyFriendly: boolean
): number {
  if (!studentNeedsAnxietyFriendly) {
    return 100;
  }

  return instructorIsAnxietyFriendly ? 100 : 0;
}

/**
 * Calculate specialism relevance score.
 * More specialisms = higher versatility score.
 */
function calculateSpecialismScore(specialisms: string[]): number {
  if (specialisms.length === 0) {
    return 50;
  }

  if (specialisms.length >= 3) {
    return 100;
  }

  if (specialisms.length >= 1) {
    return 75;
  }

  return 50;
}

/**
 * Calculate the overall match score between a student profile and an instructor.
 * Returns a score from 0-100 with individual factor breakdowns.
 */
export function calculateMatchScore(
  studentProfile: StudentPreferences,
  instructorData: InstructorData
): MatchFactors {
  const locationScore = calculateLocationScore(
    studentProfile.postcode,
    instructorData.coveragePostcodes
  );

  const genderScore = calculateGenderScore(
    studentProfile.preferredGender,
    instructorData.gender
  );

  const languageScore = calculateLanguageScore(
    studentProfile.preferredLanguage,
    instructorData.languages
  );

  const styleScore = calculateStyleScore(
    studentProfile.preferredTeachingStyle,
    instructorData.teachingStyle
  );

  const carScore = calculateCarScore(
    studentProfile.preferredCarType,
    instructorData.carType
  );

  const availabilityScore = calculateAvailabilityScore(
    studentProfile.availabilityPattern,
    instructorData.availability
  );

  const anxietyScore = calculateAnxietyScore(
    studentProfile.anxietyFriendly,
    instructorData.anxietyFriendly
  );

  const specialismScore = calculateSpecialismScore(
    instructorData.specialisms
  );

  const overallScore =
    locationScore * WEIGHTS.location +
    genderScore * WEIGHTS.gender +
    languageScore * WEIGHTS.language +
    styleScore * WEIGHTS.style +
    carScore * WEIGHTS.car +
    availabilityScore * WEIGHTS.availability +
    anxietyScore * WEIGHTS.anxiety +
    specialismScore * WEIGHTS.specialism;

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    locationScore,
    genderScore,
    languageScore,
    styleScore,
    carScore,
    availabilityScore,
    anxietyScore,
    specialismScore,
  };
}

/**
 * Find the top matching instructors for a given student.
 * Fetches the student profile and all instructors, scores them,
 * and returns the top N results sorted by score.
 */
export async function findTopMatches(
  studentId: string,
  limit: number = 10
): Promise<MatchResult[]> {
  // Fetch student profile
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  if (!studentProfile) {
    throw new Error("Student profile not found");
  }

  // Fetch all active instructor profiles
  const instructors = await prisma.instructorProfile.findMany({
    include: {
      user: true,
      availability: true,
    },
  });

  // Calculate scores for each instructor
  const results: MatchResult[] = instructors.map((instructor) => {
    const factors = calculateMatchScore(
      {
        postcode: studentProfile.postcode,
        preferredGender: studentProfile.preferredGender,
        preferredLanguage: studentProfile.preferredLanguage,
        preferredTeachingStyle: studentProfile.preferredTeachingStyle,
        preferredCarType: studentProfile.preferredCarType,
        anxietyFriendly: studentProfile.anxietyFriendly,
        availabilityPattern: studentProfile.availabilityPattern,
      },
      {
        id: instructor.id,
        userId: instructor.userId,
        coveragePostcodes: instructor.coveragePostcodes,
        gender: instructor.gender,
        languages: instructor.languages,
        teachingStyle: instructor.teachingStyle,
        carType: instructor.carType,
        anxietyFriendly: instructor.anxietyFriendly,
        specialisms: instructor.specialisms,
        availability: instructor.availability.map((a) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        })),
      }
    );

    return {
      instructorId: instructor.id,
      instructorName: instructor.user.name,
      ...factors,
    };
  });

  // Sort by overall score descending and return top N
  return results
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);
}
