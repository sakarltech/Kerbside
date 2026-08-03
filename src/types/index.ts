import type {
  User,
  InstructorProfile,
  StudentProfile,
  Booking,
  Review,
  Availability,
} from "@prisma/client";

// Extended types with relations

export interface InstructorWithProfile extends User {
  instructorProfile: InstructorProfile & {
    availability: Availability[];
    reviews: Review[];
  };
}

export interface StudentWithProfile extends User {
  studentProfile: StudentProfile;
}

export interface BookingWithDetails extends Booking {
  student: StudentProfile & { user: User };
  instructor: InstructorProfile & { user: User };
  review: Review | null;
}

// Match result types

export interface MatchFactors {
  overallScore: number;
  locationScore: number;
  genderScore: number;
  languageScore: number;
  styleScore: number;
  carScore: number;
  availabilityScore: number;
  anxietyScore: number;
  specialismScore: number;
}

export interface MatchResult extends MatchFactors {
  instructorId: string;
  instructorName: string;
}

// API response types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Session types (extend NextAuth types)

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}

// Dashboard stats types

export interface InstructorDashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedLessons: number;
  averageRating: number;
  totalEarnings: number;
  monthlyEarnings: number;
}

export interface StudentDashboardStats {
  totalLessons: number;
  upcomingBookings: number;
  totalSpent: number;
  progressSkills: number;
}

// Search and filter types

export interface InstructorSearchFilters {
  postcode?: string;
  maxDistance?: number;
  gender?: string;
  language?: string;
  teachingStyle?: string;
  carType?: string;
  anxietyFriendly?: boolean;
  maxHourlyRate?: number;
  minRating?: number;
  availability?: string;
}
