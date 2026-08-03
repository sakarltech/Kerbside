/**
 * Integration tests for the matching API route.
 * Tests POST /api/matching.
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
  },
}));

// Mock matching service
jest.mock("@/lib/services/matching-service", () => ({
  matchingService: {
    findMatchesForStudent: jest.fn(),
    refreshMatchScores: jest.fn(),
  },
}));

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { matchingService } from "@/lib/services/matching-service";

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockMatchingService = matchingService as jest.Mocked<
  typeof matchingService
>;

function createRequest(
  url: string,
  options: { method?: string; body?: unknown } = {}
) {
  const { method = "POST", body } = options;
  return new NextRequest(new URL(url, "http://localhost:3000"), {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

describe("POST /api/matching", () => {
  let POST: (request: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const routeModule = await import("@/app/api/matching/route");
    POST = routeModule.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when unauthenticated", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createRequest("http://localhost:3000/api/matching", {
      body: {},
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when non-student user attempts matching", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "INSTRUCTOR" },
    });

    const request = createRequest("http://localhost:3000/api/matching", {
      body: {},
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return sorted matches with scores", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    const mockMatches = [
      {
        instructorId: "inst-1",
        instructorName: "Sarah Jones",
        overallScore: 92.5,
        locationScore: 100,
        genderScore: 100,
        languageScore: 100,
        styleScore: 100,
        carScore: 100,
        availabilityScore: 80,
        anxietyScore: 100,
        specialismScore: 75,
      },
      {
        instructorId: "inst-2",
        instructorName: "Mike Brown",
        overallScore: 78.3,
        locationScore: 50,
        genderScore: 100,
        languageScore: 100,
        styleScore: 75,
        carScore: 100,
        availabilityScore: 60,
        anxietyScore: 0,
        specialismScore: 100,
      },
    ];

    (mockMatchingService.findMatchesForStudent as jest.Mock).mockResolvedValue(
      mockMatches
    );
    (mockMatchingService.refreshMatchScores as jest.Mock).mockResolvedValue(
      undefined
    );

    const request = createRequest("http://localhost:3000/api/matching", {
      body: { limit: 10 },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].overallScore).toBeGreaterThan(data.data[1].overallScore);
    expect(data.data[0].instructorName).toBe("Sarah Jones");
  });

  it("should call refreshMatchScores to store results in MatchScore table", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue({
      id: "student-1",
      userId: "user-1",
    });

    (mockMatchingService.findMatchesForStudent as jest.Mock).mockResolvedValue(
      []
    );
    (mockMatchingService.refreshMatchScores as jest.Mock).mockResolvedValue(
      undefined
    );

    const request = createRequest("http://localhost:3000/api/matching", {
      body: {},
    });

    await POST(request);

    expect(mockMatchingService.refreshMatchScores).toHaveBeenCalledWith(
      "student-1"
    );
  });

  it("should return 404 when student profile not found", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "user-1", role: "STUDENT" },
    });

    (mockPrisma.studentProfile.findUnique as jest.Mock).mockResolvedValue(null);

    const request = createRequest("http://localhost:3000/api/matching", {
      body: {},
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});
