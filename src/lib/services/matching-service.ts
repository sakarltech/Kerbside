import prisma from "@/lib/prisma";
import { calculateMatchScore, findTopMatches } from "@/lib/matching";
import type { MatchResult } from "@/types";

/**
 * MatchingService orchestrates the matching algorithm, manages cached scores,
 * and provides an interface for finding instructor matches for students.
 */
export class MatchingService {
  /**
   * Find the top matching instructors for a student.
   * Loads student profile, scores all verified instructors, returns top N.
   */
  async findMatchesForStudent(
    studentId: string,
    limit: number = 10
  ): Promise<MatchResult[]> {
    return findTopMatches(studentId, limit);
  }

  /**
   * Recalculate and store match scores in the MatchScore table.
   * This refreshes the cached scores for a student against all instructors.
   */
  async refreshMatchScores(studentId: string): Promise<void> {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });

    if (!studentProfile) {
      throw new Error("Student profile not found");
    }

    const instructors = await prisma.instructorProfile.findMany({
      include: { availability: true, user: true },
    });

    for (const instructor of instructors) {
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

      await prisma.matchScore.upsert({
        where: {
          studentId_instructorId: {
            studentId: studentProfile.id,
            instructorId: instructor.id,
          },
        },
        update: {
          overallScore: factors.overallScore,
          locationScore: factors.locationScore,
          genderScore: factors.genderScore,
          languageScore: factors.languageScore,
          styleScore: factors.styleScore,
          carScore: factors.carScore,
          availabilityScore: factors.availabilityScore,
          anxietyScore: factors.anxietyScore,
          specialismScore: factors.specialismScore,
        },
        create: {
          studentId: studentProfile.id,
          instructorId: instructor.id,
          overallScore: factors.overallScore,
          locationScore: factors.locationScore,
          genderScore: factors.genderScore,
          languageScore: factors.languageScore,
          styleScore: factors.styleScore,
          carScore: factors.carScore,
          availabilityScore: factors.availabilityScore,
          anxietyScore: factors.anxietyScore,
          specialismScore: factors.specialismScore,
        },
      });
    }
  }

  /**
   * Get cached match scores from the database for a student.
   * Returns previously calculated scores sorted by overall score descending.
   */
  async getStoredMatches(studentId: string): Promise<MatchResult[]> {
    const scores = await prisma.matchScore.findMany({
      where: { studentId },
      include: {
        instructor: {
          include: { user: true },
        },
      },
      orderBy: { overallScore: "desc" },
    });

    return scores.map((score) => ({
      instructorId: score.instructorId,
      instructorName: score.instructor.user.name,
      overallScore: score.overallScore,
      locationScore: score.locationScore,
      genderScore: score.genderScore,
      languageScore: score.languageScore,
      styleScore: score.styleScore,
      carScore: score.carScore,
      availabilityScore: score.availabilityScore,
      anxietyScore: score.anxietyScore,
      specialismScore: score.specialismScore,
    }));
  }
}

export const matchingService = new MatchingService();
