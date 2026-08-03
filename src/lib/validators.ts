import { z } from "zod";

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Instructor registration schema
export const instructorRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  adiNumber: z
    .string()
    .min(1, "ADI number is required")
    .regex(/^\d{6}$/, "ADI number must be 6 digits"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  specialisms: z.array(z.string()).default([]),
  teachingStyle: z
    .enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"])
    .optional(),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  carType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]),
  gender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
  anxietyFriendly: z.boolean().default(false),
  hourlyRate: z
    .number()
    .min(20, "Hourly rate must be at least 20")
    .max(100, "Hourly rate must be 100 or less"),
  coveragePostcodes: z
    .array(z.string())
    .min(1, "At least one coverage postcode is required"),
});

// Student registration schema
export const studentRegistrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  postcode: z.string().min(5, "Please enter a valid postcode"),
  preferredGender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).optional(),
  preferredLanguage: z.string().optional(),
  preferredTeachingStyle: z
    .enum(["PATIENT", "INTENSIVE", "STRUCTURED", "RELAXED", "ADAPTIVE"])
    .optional(),
  preferredCarType: z.enum(["MANUAL", "AUTOMATIC", "BOTH"]).optional(),
  anxietyFriendly: z.boolean().default(false),
  preferredLessonFormat: z.enum(["HOURLY", "BLOCK_5", "BLOCK_10"]).optional(),
  pickupFlexibilityKm: z.number().min(1).max(30).default(5),
  goalTimeline: z.string().optional(),
  availabilityPattern: z.string().optional(),
});

// Booking schema
export const bookingSchema = z.object({
  instructorId: z.string().cuid("Invalid instructor ID"),
  dateTime: z.string().datetime("Invalid date/time format"),
  durationMinutes: z
    .number()
    .min(30, "Minimum lesson duration is 30 minutes")
    .max(180, "Maximum lesson duration is 180 minutes"),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

// Review schema
export const reviewSchema = z.object({
  bookingId: z.string().cuid("Invalid booking ID"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .max(1000, "Comment must be 1000 characters or less")
    .optional(),
});

// Message schema
export const messageSchema = z.object({
  receiverId: z.string().cuid("Invalid receiver ID"),
  bookingId: z.string().cuid("Invalid booking ID").optional(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less"),
});

// Availability schema
export const availabilitySchema = z.object({
  dayOfWeek: z
    .number()
    .int()
    .min(0, "Day must be between 0 (Sunday) and 6 (Saturday)")
    .max(6, "Day must be between 0 (Sunday) and 6 (Saturday)"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm format"),
  isRecurring: z.boolean().default(true),
  specificDate: z.string().datetime().optional(),
});

// Type exports inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type InstructorRegistrationInput = z.infer<
  typeof instructorRegistrationSchema
>;
export type StudentRegistrationInput = z.infer<
  typeof studentRegistrationSchema
>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
