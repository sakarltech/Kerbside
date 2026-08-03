/**
 * Integration tests for the bookings API routes.
 * Tests POST /api/bookings and PUT /api/bookings/[id].
 */
import { NextRequest } from "next/server";

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock auth options
jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

// Mock prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    studentProfile: {
      findUnique: jest.fn(),
    },
    instructorProfile: {
      findUnique: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock booking service
jest.mock("@/lib/services/booking-service", () => ({
  bookingService: {
    createBooking: jest.fn(),
    cancelBooking: jest.fn(),
    completeBooking: jest.fn(),
  },
}));

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { bookingService } from "@/lib/services/booking-service";

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockBookingService = bookingService as jest.Mocked<typeof bookingService>;

// Helper to create NextRequest
function createRequest(
  url: string,
  options: { method?: string; body?: unknown } = {}
) {
  const { method = "GET", body } = options;
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

describe("POST /api/bookings", () => {
  let POST: (request: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const module = await import("@/app/api/bookings/route");
    POST = module.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: {
        instructorId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        dateTime: new Date().toISOString(),
        durationMinutes: 60,
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when non-student role attempts to create booking", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "INSTRUCTOR" },
    });

    const request = createRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: {
        instructorId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        dateTime: new Date().toISOString(),
        durationMinutes: 60,
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return 400 with validation errors for invalid body", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    const request = createRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: {
        instructorId: "invalid",
        dateTime: "not-a-date",
        durationMinutes: 10,
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it("should create booking successfully and return 201", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    const mockBooking = {
      id: "booking-1",
      studentId: "student-1",
      instructorId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      dateTime: new Date(),
      durationMinutes: 60,
      status: "PENDING",
      amount: 35,
      commission: 5.25,
      paymentIntentId: "pi_test_123",
    };

    (mockBookingService.createBooking as jest.Mock).mockResolvedValue(
      mockBooking
    );

    const request = createRequest("http://localhost:3000/api/bookings", {
      method: "POST",
      body: {
        instructorId: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: 60,
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.paymentIntentId).toBe("pi_test_123");
  });
});

describe("GET /api/bookings", () => {
  let GET: (request: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const module = await import("@/app/api/bookings/route");
    GET = module.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return paginated bookings for authenticated user", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    const mockBookings = [
      {
        id: "booking-1",
        studentId: "student-1",
        status: "PENDING",
        dateTime: new Date(),
      },
      {
        id: "booking-2",
        studentId: "student-1",
        status: "CONFIRMED",
        dateTime: new Date(),
      },
    ];

    (mockPrisma.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);
    (mockPrisma.booking.count as jest.Mock).mockResolvedValue(2);

    const request = createRequest(
      "http://localhost:3000/api/bookings?page=1&limit=10"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.totalItems).toBe(2);
  });

  it("should return 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createRequest("http://localhost:3000/api/bookings");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});

describe("PUT /api/bookings/[id]", () => {
  let PUT: (
    request: NextRequest,
    context: { params: { id: string } }
  ) => Promise<Response>;

  beforeAll(async () => {
    const module = await import("@/app/api/bookings/[id]/route");
    PUT = module.PUT;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should allow instructor to confirm a booking", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "inst-user-1", role: "INSTRUCTOR" },
    });

    (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue({
      id: "booking-1",
      studentId: "student-1",
      instructorId: "inst-1",
      status: "PENDING",
      dateTime: new Date(Date.now() + 86400000 * 3),
      student: { userId: "stu-user-1" },
      instructor: { userId: "inst-user-1" },
    });

    (mockPrisma.booking.update as jest.Mock).mockResolvedValue({
      id: "booking-1",
      status: "CONFIRMED",
    });

    const request = createRequest(
      "http://localhost:3000/api/bookings/booking-1",
      {
        method: "PUT",
        body: { status: "CONFIRMED" },
      }
    );

    const response = await PUT(request, { params: { id: "booking-1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("CONFIRMED");
  });

  it("should allow student cancellation with >24h notice and process refund", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "stu-user-1", role: "STUDENT" },
    });

    const futureDate = new Date(Date.now() + 86400000 * 3); // 3 days ahead
    (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue({
      id: "booking-1",
      studentId: "student-1",
      instructorId: "inst-1",
      status: "CONFIRMED",
      dateTime: futureDate,
      paymentIntentId: "pi_test_123",
      student: { userId: "stu-user-1" },
      instructor: { userId: "inst-user-1" },
    });

    (mockBookingService.cancelBooking as jest.Mock).mockResolvedValue({
      id: "booking-1",
      status: "CANCELLED",
    });

    const request = createRequest(
      "http://localhost:3000/api/bookings/booking-1",
      {
        method: "PUT",
        body: { status: "CANCELLED" },
      }
    );

    const response = await PUT(request, { params: { id: "booking-1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("CANCELLED");
  });

  it("should reject student cancellation with <24h notice", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "stu-user-1", role: "STUDENT" },
    });

    const soonDate = new Date(Date.now() + 3600000 * 12); // 12 hours ahead
    (mockPrisma.booking.findUnique as jest.Mock).mockResolvedValue({
      id: "booking-1",
      studentId: "student-1",
      instructorId: "inst-1",
      status: "CONFIRMED",
      dateTime: soonDate,
      student: { userId: "stu-user-1" },
      instructor: { userId: "inst-user-1" },
    });

    const request = createRequest(
      "http://localhost:3000/api/bookings/booking-1",
      {
        method: "PUT",
        body: { status: "CANCELLED" },
      }
    );

    const response = await PUT(request, { params: { id: "booking-1" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("24 hours");
  });

  it("should return 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createRequest(
      "http://localhost:3000/api/bookings/booking-1",
      {
        method: "PUT",
        body: { status: "CONFIRMED" },
      }
    );

    const response = await PUT(request, { params: { id: "booking-1" } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });
});
