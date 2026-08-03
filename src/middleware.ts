import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// API routes that require authentication
const protectedApiRoutes = [
  "/api/bookings",
  "/api/messages",
  "/api/profile",
  "/api/progress",
  "/api/admin",
  "/api/payments/connect",
  "/api/matching",
  "/api/students",
];

// Public routes that should redirect authenticated users
const authRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Return 401 for unauthenticated API requests
  if (isProtectedApiRoute && !token) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/bookings/:path*",
    "/api/messages/:path*",
    "/api/profile/:path*",
    "/api/progress/:path*",
    "/api/admin/:path*",
    "/api/payments/connect/:path*",
    "/api/matching/:path*",
    "/api/students/:path*",
    "/auth/:path*",
  ],
};
