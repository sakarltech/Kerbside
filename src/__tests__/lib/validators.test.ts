import {
  loginSchema,
  instructorRegistrationSchema,
  studentRegistrationSchema,
  bookingSchema,
  reviewSchema,
  messageSchema,
  availabilitySchema,
} from "@/lib/validators";

describe("loginSchema", () => {
  it("should pass with valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when email is missing", () => {
    const result = loginSchema.safeParse({
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when password is too short", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("at least 8");
    }
  });
});

describe("instructorRegistrationSchema", () => {
  const validInput = {
    email: "instructor@example.com",
    password: "Secure1Pass",
    name: "Jane Smith",
    adiNumber: "123456",
    languages: ["English"],
    carType: "MANUAL",
    hourlyRate: 35,
    coveragePostcodes: ["SW1A"],
  };

  it("should pass with valid full input", () => {
    const result = instructorRegistrationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail when required fields are missing", () => {
    const result = instructorRegistrationSchema.safeParse({
      email: "instructor@example.com",
      password: "Secure1Pass",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with invalid ADI number format (non-6-digit)", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      adiNumber: "12345", // Only 5 digits
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const adiIssue = result.error.issues.find((i) =>
        i.path.includes("adiNumber")
      );
      expect(adiIssue).toBeDefined();
    }
  });

  it("should fail with invalid ADI number format (letters)", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      adiNumber: "abc123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when password does not meet complexity requirements", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      password: "alllowercase",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when languages array is empty", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      languages: [],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when hourly rate is below minimum", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      hourlyRate: 15,
    });
    expect(result.success).toBe(false);
  });

  it("should fail when hourly rate is above maximum", () => {
    const result = instructorRegistrationSchema.safeParse({
      ...validInput,
      hourlyRate: 150,
    });
    expect(result.success).toBe(false);
  });
});

describe("studentRegistrationSchema", () => {
  const validInput = {
    email: "student@example.com",
    password: "Secure1Pass",
    name: "John Doe",
    postcode: "SW1A 1AA",
  };

  it("should pass with valid input", () => {
    const result = studentRegistrationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail with invalid postcode (too short)", () => {
    const result = studentRegistrationSchema.safeParse({
      ...validInput,
      postcode: "SW",
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional fields", () => {
    const result = studentRegistrationSchema.safeParse({
      ...validInput,
      preferredGender: "FEMALE",
      preferredLanguage: "English",
      preferredTeachingStyle: "PATIENT",
      preferredCarType: "AUTOMATIC",
      anxietyFriendly: true,
    });
    expect(result.success).toBe(true);
  });
});

describe("bookingSchema", () => {
  const validInput = {
    instructorId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
    dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    durationMinutes: 60,
  };

  it("should pass with valid input", () => {
    const result = bookingSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail with invalid instructor ID format", () => {
    const result = bookingSchema.safeParse({
      ...validInput,
      instructorId: "not-a-cuid",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with invalid date format", () => {
    const result = bookingSchema.safeParse({
      ...validInput,
      dateTime: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with duration below minimum (30)", () => {
    const result = bookingSchema.safeParse({
      ...validInput,
      durationMinutes: 15,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("30 minutes");
    }
  });

  it("should fail with duration above maximum (180)", () => {
    const result = bookingSchema.safeParse({
      ...validInput,
      durationMinutes: 240,
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional notes", () => {
    const result = bookingSchema.safeParse({
      ...validInput,
      notes: "Please arrive 5 minutes early",
    });
    expect(result.success).toBe(true);
  });
});

describe("reviewSchema", () => {
  const validInput = {
    bookingId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
    rating: 4,
    comment: "Great lesson, very patient instructor!",
  };

  it("should pass with valid rating (1-5)", () => {
    const result = reviewSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should pass with rating of 1", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 1 });
    expect(result.success).toBe(true);
  });

  it("should pass with rating of 5", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 5 });
    expect(result.success).toBe(true);
  });

  it("should fail with rating below 1", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 0 });
    expect(result.success).toBe(false);
  });

  it("should fail with rating above 5", () => {
    const result = reviewSchema.safeParse({ ...validInput, rating: 6 });
    expect(result.success).toBe(false);
  });

  it("should pass without a comment (optional)", () => {
    const result = reviewSchema.safeParse({
      bookingId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      rating: 5,
    });
    expect(result.success).toBe(true);
  });
});

describe("messageSchema", () => {
  const validInput = {
    receiverId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
    content: "Hello, I would like to book a lesson.",
  };

  it("should pass with valid message", () => {
    const result = messageSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail with empty content", () => {
    const result = messageSchema.safeParse({
      ...validInput,
      content: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with content exceeding 2000 characters", () => {
    const result = messageSchema.safeParse({
      ...validInput,
      content: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional bookingId", () => {
    const result = messageSchema.safeParse({
      ...validInput,
      bookingId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
    });
    expect(result.success).toBe(true);
  });
});

describe("availabilitySchema", () => {
  const validInput = {
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  };

  it("should pass with valid availability slot", () => {
    const result = availabilitySchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should fail with dayOfWeek greater than 6", () => {
    const result = availabilitySchema.safeParse({
      ...validInput,
      dayOfWeek: 7,
    });
    expect(result.success).toBe(false);
  });

  it("should fail with dayOfWeek less than 0", () => {
    const result = availabilitySchema.safeParse({
      ...validInput,
      dayOfWeek: -1,
    });
    expect(result.success).toBe(false);
  });

  it("should fail with invalid time format", () => {
    const result = availabilitySchema.safeParse({
      ...validInput,
      startTime: "9:00", // Missing leading zero
    });
    expect(result.success).toBe(false);
  });

  it("should fail with time out of range", () => {
    const result = availabilitySchema.safeParse({
      ...validInput,
      startTime: "25:00",
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional specificDate", () => {
    const result = availabilitySchema.safeParse({
      ...validInput,
      specificDate: "2024-06-15T09:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("should accept Sunday (0) and Saturday (6)", () => {
    const sunday = availabilitySchema.safeParse({ ...validInput, dayOfWeek: 0 });
    const saturday = availabilitySchema.safeParse({ ...validInput, dayOfWeek: 6 });
    expect(sunday.success).toBe(true);
    expect(saturday.success).toBe(true);
  });
});
