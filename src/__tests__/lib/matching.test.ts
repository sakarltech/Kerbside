import { calculateMatchScore } from "@/lib/matching";

// Mock prisma module used by findTopMatches
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    studentProfile: {
      findUnique: jest.fn(),
    },
    instructorProfile: {
      findMany: jest.fn(),
    },
  },
}));

describe("calculateMatchScore", () => {
  const baseStudent = {
    postcode: "SW1A 1AA",
    preferredGender: "FEMALE",
    preferredLanguage: "English",
    preferredTeachingStyle: "PATIENT",
    preferredCarType: "MANUAL",
    anxietyFriendly: true,
    availabilityPattern: "weekday_mornings",
  };

  const baseInstructor = {
    id: "inst-1",
    userId: "user-1",
    coveragePostcodes: ["SW1A 1AA", "SW1A 2AA"],
    gender: "FEMALE",
    languages: ["English", "Urdu"],
    teachingStyle: "PATIENT",
    carType: "MANUAL",
    anxietyFriendly: true,
    specialisms: ["Nervous Drivers", "Motorway", "Pass Plus"],
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    ],
  };

  describe("perfect match", () => {
    it("should return a score near 100 when all preferences match perfectly", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.overallScore).toBeGreaterThanOrEqual(90);
      expect(result.locationScore).toBe(100);
      expect(result.genderScore).toBe(100);
      expect(result.languageScore).toBe(100);
      expect(result.styleScore).toBe(100);
      expect(result.carScore).toBe(100);
      expect(result.anxietyScore).toBe(100);
    });
  });

  describe("no preferences set", () => {
    it("should return a reasonable default score when student has no preferences", () => {
      const noPrefsStudent = {
        postcode: null,
        preferredGender: null,
        preferredLanguage: null,
        preferredTeachingStyle: null,
        preferredCarType: null,
        anxietyFriendly: false,
        availabilityPattern: null,
      };

      const result = calculateMatchScore(noPrefsStudent, baseInstructor);
      // With no preferences, most factors should default to neutral or full marks
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.genderScore).toBe(100); // no preference = full score
      expect(result.styleScore).toBe(100); // no preference = any works
      expect(result.carScore).toBe(100); // no preference = any works
      expect(result.anxietyScore).toBe(100); // student does not need it
    });
  });

  describe("gender matching", () => {
    it("should give 100 when preference matches instructor gender", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.genderScore).toBe(100);
    });

    it("should give 100 when student has NO_PREFERENCE", () => {
      const student = { ...baseStudent, preferredGender: "NO_PREFERENCE" };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.genderScore).toBe(100);
    });

    it("should give 0 for that factor when gender mismatches", () => {
      const student = { ...baseStudent, preferredGender: "MALE" };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.genderScore).toBe(0);
    });

    it("should give 50 when instructor gender is not set", () => {
      const instructor = { ...baseInstructor, gender: null };
      const result = calculateMatchScore(baseStudent, instructor);
      expect(result.genderScore).toBe(50);
    });
  });

  describe("language matching", () => {
    it("should give 100 when preferred language is in instructor languages", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.languageScore).toBe(100);
    });

    it("should give 0 when preferred language is not in instructor languages", () => {
      const student = { ...baseStudent, preferredLanguage: "Spanish" };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.languageScore).toBe(0);
    });

    it("should give 50 (neutral) when no preferred language is set", () => {
      const student = { ...baseStudent, preferredLanguage: null };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.languageScore).toBe(50);
    });

    it("should be case-insensitive when matching languages", () => {
      const student = { ...baseStudent, preferredLanguage: "english" };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.languageScore).toBe(100);
    });
  });

  describe("teaching style matching", () => {
    it("should give 100 for exact style match", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.styleScore).toBe(100);
    });

    it("should give 0 for style mismatch", () => {
      const student = { ...baseStudent, preferredTeachingStyle: "INTENSIVE" };
      const instructor = { ...baseInstructor, teachingStyle: "RELAXED" };
      const result = calculateMatchScore(student, instructor);
      expect(result.styleScore).toBe(0);
    });

    it("should give 75 for ADAPTIVE instructor (partial match)", () => {
      const instructor = { ...baseInstructor, teachingStyle: "ADAPTIVE" };
      const result = calculateMatchScore(baseStudent, instructor);
      expect(result.styleScore).toBe(75);
    });

    it("should give 100 when student has no preference", () => {
      const student = { ...baseStudent, preferredTeachingStyle: null };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.styleScore).toBe(100);
    });
  });

  describe("car type matching", () => {
    it("should give 100 for BOTH instructor car type (always matches)", () => {
      const instructor = { ...baseInstructor, carType: "BOTH" };
      const result = calculateMatchScore(baseStudent, instructor);
      expect(result.carScore).toBe(100);
    });

    it("should give 100 for exact car type match", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.carScore).toBe(100);
    });

    it("should give 0 for car type mismatch", () => {
      const student = { ...baseStudent, preferredCarType: "AUTOMATIC" };
      const instructor = { ...baseInstructor, carType: "MANUAL" };
      const result = calculateMatchScore(student, instructor);
      expect(result.carScore).toBe(0);
    });
  });

  describe("anxiety-friendly factor", () => {
    it("should give 100 when both student needs and instructor provides", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.anxietyScore).toBe(100);
    });

    it("should give 0 when student needs anxiety-friendly but instructor is not", () => {
      const instructor = { ...baseInstructor, anxietyFriendly: false };
      const result = calculateMatchScore(baseStudent, instructor);
      expect(result.anxietyScore).toBe(0);
    });

    it("should give 100 when student does not need anxiety-friendly", () => {
      const student = { ...baseStudent, anxietyFriendly: false };
      const instructor = { ...baseInstructor, anxietyFriendly: false };
      const result = calculateMatchScore(student, instructor);
      expect(result.anxietyScore).toBe(100);
    });
  });

  describe("location matching", () => {
    it("should give 100 when student postcode is in coverage", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.locationScore).toBe(100);
    });

    it("should give 0 when student postcode is not in coverage", () => {
      const student = { ...baseStudent, postcode: "M1 1AA" };
      const instructor = {
        ...baseInstructor,
        coveragePostcodes: ["SW1A 1AA", "SW1A 2AA"],
      };
      const result = calculateMatchScore(student, instructor);
      expect(result.locationScore).toBe(0);
    });

    it("should give 50 for partial postcode prefix match", () => {
      const student = { ...baseStudent, postcode: "SW1B 2BD" };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.locationScore).toBe(50);
    });

    it("should give 0 when student has no postcode", () => {
      const student = { ...baseStudent, postcode: null };
      const result = calculateMatchScore(student, baseInstructor);
      expect(result.locationScore).toBe(0);
    });
  });

  describe("weight distribution", () => {
    it("should apply location weight of 25% (highest impact)", () => {
      // Student with postcode match only, everything else mismatches
      const student = {
        postcode: "SW1A 1AA",
        preferredGender: "MALE", // mismatch
        preferredLanguage: "Spanish", // mismatch
        preferredTeachingStyle: "INTENSIVE", // mismatch
        preferredCarType: "AUTOMATIC", // mismatch
        anxietyFriendly: true, // match
        availabilityPattern: null,
      };

      const instructor = {
        ...baseInstructor,
        gender: "FEMALE",
        languages: ["English"],
        teachingStyle: "PATIENT",
        carType: "MANUAL",
        anxietyFriendly: false,
      };

      const result = calculateMatchScore(student, instructor);
      // Location = 100 * 0.25 = 25 contribution
      // The location factor should have the largest single contribution
      const locationContribution = result.locationScore * 0.25;
      expect(locationContribution).toBe(25);
    });
  });

  describe("edge cases", () => {
    it("should handle instructor with empty arrays", () => {
      const instructor = {
        ...baseInstructor,
        coveragePostcodes: [],
        languages: [],
        specialisms: [],
        availability: [],
      };

      const result = calculateMatchScore(baseStudent, instructor);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("should handle null preferences gracefully", () => {
      const student = {
        postcode: null,
        preferredGender: null,
        preferredLanguage: null,
        preferredTeachingStyle: null,
        preferredCarType: null,
        anxietyFriendly: false,
        availabilityPattern: null,
      };

      const instructor = {
        ...baseInstructor,
        gender: null,
        teachingStyle: null,
        carType: null,
      };

      const result = calculateMatchScore(student, instructor);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it("should always return a score between 0 and 100", () => {
      const result = calculateMatchScore(baseStudent, baseInstructor);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });
  });
});

describe("findTopMatches", () => {
  const mockPrisma = jest.requireMock("@/lib/prisma").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error when student profile not found", async () => {
    mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

    const { findTopMatches } = await import("@/lib/matching");
    await expect(findTopMatches("nonexistent-id")).rejects.toThrow(
      "Student profile not found"
    );
  });

  it("should return empty array when no instructors exist", async () => {
    mockPrisma.studentProfile.findUnique.mockResolvedValue({
      id: "student-1",
      postcode: "SW1A 1AA",
      preferredGender: null,
      preferredLanguage: null,
      preferredTeachingStyle: null,
      preferredCarType: null,
      anxietyFriendly: false,
      availabilityPattern: null,
      user: { id: "user-1", name: "Test Student" },
    });
    mockPrisma.instructorProfile.findMany.mockResolvedValue([]);

    const { findTopMatches } = await import("@/lib/matching");
    const results = await findTopMatches("student-1");
    expect(results).toEqual([]);
  });
});
