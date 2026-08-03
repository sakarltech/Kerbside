# KerbSide - Technical Architecture Document

## 1. System Overview

KerbSide is a full-stack Next.js 14 application using the App Router pattern. It follows a monolithic architecture deployed as a containerized Node.js application with a PostgreSQL database and external integrations with Stripe for payments and NextAuth.js for authentication.

```
+------------------------------------------+
|             Client (Browser)             |
|  Next.js Pages (React Server Components) |
|  + Client Components (interactive UI)    |
+------------------------------------------+
                    |
                    | HTTPS
                    v
+------------------------------------------+
|          Next.js Application Server       |
|  +-------------------------------------+ |
|  | App Router (src/app/)               | |
|  |  - Pages (Server Components)        | |
|  |  - API Routes (Route Handlers)      | |
|  |  - Middleware (auth, routing)        | |
|  +-------------------------------------+ |
|  | Service Layer (src/lib/services/)   | |
|  |  - BookingService                   | |
|  |  - PaymentService                   | |
|  |  - MatchingService                  | |
|  |  - NotificationService             | |
|  +-------------------------------------+ |
|  | Core Libraries (src/lib/)           | |
|  |  - auth.ts (NextAuth config)        | |
|  |  - prisma.ts (DB client)           | |
|  |  - stripe.ts (Stripe client)       | |
|  |  - matching.ts (algorithm)          | |
|  |  - validators.ts (Zod schemas)     | |
|  +-------------------------------------+ |
+------------------------------------------+
          |                    |
          v                    v
+----------------+    +------------------+
|  PostgreSQL    |    |  Stripe API      |
|  (via Prisma)  |    |  (Connect)       |
+----------------+    +------------------+
```

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 14.1.0 | Full-stack React framework with App Router |
| Language | TypeScript | 5.3.3 | Type-safe development |
| Runtime | Node.js | 22 (Alpine) | Server execution environment |
| UI | React | 18.2 | Component-based UI |
| Styling | Tailwind CSS | 3.4.1 | Utility-first CSS |
| Database | PostgreSQL | 16 | Relational data storage |
| ORM | Prisma | 5.10.0 | Database access and migrations |
| Authentication | NextAuth.js | 4.24.5 | Session management, JWT tokens |
| Payments | Stripe Connect | 14.14.0 | Marketplace payments |
| Validation | Zod | 3.22.4 | Runtime schema validation |
| Icons | Lucide React | 0.344.0 | Icon library |
| Dates | date-fns | 3.3.0 | Date manipulation |
| Testing | Jest + RTL | 29.7 / 14.2 | Unit and component tests |
| Container | Docker | Multi-stage | Production deployment |
| CI/CD | GitHub Actions | - | Automated pipeline |

---

## 3. Directory Structure

```
kerbside/
|-- src/
|   |-- app/                          # Next.js App Router
|   |   |-- layout.tsx                # Root layout
|   |   |-- page.tsx                  # Landing page
|   |   |-- globals.css               # Global styles
|   |   |-- auth/
|   |   |   |-- signin/page.tsx       # Sign in
|   |   |   |-- register/
|   |   |       |-- instructor/page.tsx
|   |   |       |-- student/page.tsx
|   |   |-- dashboard/
|   |   |   |-- layout.tsx            # Dashboard layout with sidebar
|   |   |   |-- page.tsx              # Role-based redirect
|   |   |   |-- instructor/           # Instructor dashboard pages
|   |   |   |-- student/              # Student dashboard pages
|   |   |   |-- messages/page.tsx     # Messaging interface
|   |   |-- instructors/
|   |   |   |-- [id]/page.tsx         # Public instructor profile
|   |   |-- booking/
|   |   |   |-- [instructorId]/page.tsx # Booking flow
|   |   |-- api/                      # API Route Handlers
|   |       |-- auth/[...nextauth]/route.ts
|   |       |-- instructors/
|   |       |-- students/
|   |       |-- matching/route.ts
|   |       |-- bookings/
|   |       |-- payments/
|   |       |-- messages/
|   |       |-- progress/
|   |       |-- admin/
|   |-- components/
|   |   |-- ui/                       # Reusable UI primitives
|   |   |-- layout/                   # Layout components
|   |   |-- matching/                 # Match-specific components
|   |   |-- booking/                  # Booking components
|   |   |-- progress/                 # Progress components
|   |   |-- reviews/                  # Review components
|   |   |-- messages/                 # Messaging components
|   |-- lib/
|   |   |-- prisma.ts                 # Prisma client singleton
|   |   |-- auth.ts                   # NextAuth configuration
|   |   |-- stripe.ts                 # Stripe helpers
|   |   |-- matching.ts              # Matching algorithm
|   |   |-- validators.ts            # Zod schemas
|   |   |-- services/
|   |       |-- booking-service.ts
|   |       |-- payment-service.ts
|   |       |-- matching-service.ts
|   |       |-- notification-service.ts
|   |-- types/
|   |   |-- index.ts                  # Shared TypeScript types
|   |-- middleware.ts                 # Route protection
|-- prisma/
|   |-- schema.prisma                 # Database schema
|   |-- seed.ts                       # Development seed data
|-- public/                           # Static assets
|-- docs/                             # Documentation
|-- .github/workflows/ci.yml          # CI/CD pipeline
|-- Dockerfile                        # Multi-stage Docker build
|-- docker-compose.yml                # Local development stack
|-- package.json
|-- tsconfig.json
|-- tailwind.config.ts
|-- next.config.js
```

---

## 4. Authentication Flow

KerbSide uses NextAuth.js with a JWT-based session strategy and credentials provider (email/password).

### Authentication Architecture

```
+--------+     POST /api/auth/signin     +----------+
| Client | -----------------------------> | NextAuth |
+--------+                                +----------+
    |                                          |
    |  1. Submit email + password              |
    |                                          v
    |                                   +----------+
    |                                   |  Prisma  |
    |                                   |  (users) |
    |                                   +----------+
    |                                          |
    |  2. Verify password (bcrypt)             |
    |                                          v
    |                                   +-----------+
    |  3. Return JWT with id + role     |  bcryptjs |
    | <-------------------------------- +-----------+
    |
    |  4. JWT stored in HTTP-only cookie
    v
+--------+     All subsequent requests     +------------+
| Client | ------------------------------> | Middleware  |
+--------+    (JWT in cookie header)       +------------+
                                                |
                                      5. Verify JWT, extract role
                                                |
                                                v
                                        +-------------+
                                        | Route Handler|
                                        | (has session)|
                                        +-------------+
```

### Session Structure
```typescript
{
  user: {
    id: string;       // User CUID
    email: string;
    name: string;
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  }
}
```

### Route Protection

The Next.js middleware (`src/middleware.ts`) protects routes at the edge:

| Route Pattern | Protection |
|---------------|-----------|
| `/dashboard/*` | Redirects to `/auth/signin` if unauthenticated |
| `/api/bookings/*` | Returns 401 JSON if unauthenticated |
| `/api/messages/*` | Returns 401 JSON if unauthenticated |
| `/api/matching/*` | Returns 401 JSON if unauthenticated |
| `/api/admin/*` | Returns 401 JSON if unauthenticated |
| `/api/payments/connect/*` | Returns 401 JSON if unauthenticated |
| `/auth/signin` | Redirects to `/dashboard` if already authenticated |

Role-based access control is enforced within individual API route handlers using `getServerSession()`.

---

## 5. Payment Flow (Stripe Connect)

KerbSide uses Stripe Connect with Express accounts and destination charges for marketplace payments.

### Instructor Onboarding to Stripe

```
+------------+     1. Click "Set up payments"     +----------+
| Instructor | ----------------------------------> | KerbSide |
+------------+                                     +----------+
                                                       |
                                    2. POST /api/payments/connect
                                                       |
                                                       v
                                                 +-----------+
                                                 |  Stripe   |
                                                 | (Connect) |
                                                 +-----------+
                                                       |
                            3. Create Express account + Account Link
                                                       |
     +------------+     4. Redirect to Stripe     +----+
     | Instructor | <-----------------------------+
     +------------+
          |
          | 5. Complete Stripe onboarding (KYC, bank details)
          v
     +----------+     6. Redirect back     +----------+
     |  Stripe  | -----------------------> | KerbSide |
     +----------+                          +----------+
                                                |
                              7. Store stripe_account_id on profile
```

### Booking Payment Flow

```
+---------+   1. Select slot + confirm   +----------+
| Student | ---------------------------> | KerbSide |
+---------+                              +----------+
                                              |
                              2. Calculate: amount + 15% commission
                              3. Create PaymentIntent (destination charge)
                                              |
                                              v
                                         +---------+
                                         | Stripe  |
                                         +---------+
                                              |
     +---------+   4. Return client_secret    |
     | Student | <----------------------------+
     +---------+
          |
          | 5. Confirm payment (card details)
          v
     +---------+     6. payment_intent.succeeded     +----------+
     | Stripe  | ----------------------------------> | Webhook  |
     +---------+                                     +----------+
                                                          |
                                          7. Update booking: CONFIRMED
                                          8. 85% auto-transferred to instructor
```

### Commission Breakdown
- Lesson price: GBP X (set by instructor)
- Platform fee: 15% of X (application_fee_amount)
- Instructor receives: 85% of X (via destination charge)
- Stripe processing fees: deducted from platform's 15%

---

## 6. Matching Algorithm Architecture

### Algorithm Design

The matching engine is a deterministic scoring system with no machine learning component (at MVP). It evaluates each instructor against a student's stated preferences.

```
+------------------+     +-------------------+
| Student Profile  |     | All Instructors   |
| (preferences)   |     | (profiles + avail)|
+------------------+     +-------------------+
         |                        |
         v                        v
+------------------------------------------+
|         Scoring Engine                    |
|  For each instructor:                    |
|    score = SUM(factor_score * weight)    |
|                                          |
|  Factors (8):                            |
|    - Location (0.25)                     |
|    - Gender (0.15)                       |
|    - Language (0.15)                     |
|    - Teaching Style (0.15)              |
|    - Car Type (0.10)                    |
|    - Availability (0.10)               |
|    - Anxiety-Friendly (0.05)           |
|    - Specialisms (0.05)               |
+------------------------------------------+
         |
         v
+------------------------------------------+
|  Sort by overallScore DESC               |
|  Return top N (default: 10)              |
+------------------------------------------+
         |
         v
+------------------------------------------+
|  Store in MatchScore table (cache)       |
|  Return to client with breakdown         |
+------------------------------------------+
```

### Scoring Functions

Each factor produces a score between 0 and 100:

| Factor | 100 (Perfect) | 50 (Partial) | 0 (No Match) |
|--------|--------------|--------------|---------------|
| Location | Exact postcode in coverage | Same postcode district prefix | No overlap |
| Gender | Matches preference or no preference | Instructor gender unknown | Preference not met |
| Language | Preferred language in instructor's list | No preference set | Language not offered |
| Style | Exact style match | ADAPTIVE instructor (flexible) | Style mismatch |
| Car | Matches or instructor teaches BOTH | - | Wrong transmission type |
| Availability | 5+ matching slots | 2-4 matching slots | No overlap |
| Anxiety | Not needed, or needed and offered | - | Needed but not offered |
| Specialism | 3+ specialisms | 1-2 specialisms | None listed |

### Caching Strategy
- Match scores are cached in the `MatchScore` table
- Scores are refreshed on demand (when student requests matches)
- Unique constraint on `[studentId, instructorId]` enables upsert
- Stored scores can be queried without recalculation for dashboard views

---

## 7. API Design

### API Conventions

All API routes follow these patterns:
- **Route handlers:** `export async function GET|POST|PUT|DELETE(request)`
- **Authentication:** `getServerSession(authOptions)` check at route start
- **Validation:** Zod schema parsing of request body
- **Response format:** `{ success: boolean, data?: T, error?: string }`
- **Error codes:** Standard HTTP (400, 401, 403, 404, 500)

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/[...nextauth]` | No | NextAuth sign-in/sign-up |
| GET | `/api/instructors` | No | List/search instructors |
| POST | `/api/instructors` | Yes | Create instructor profile |
| GET | `/api/instructors/[id]` | No | Get instructor details |
| PUT | `/api/instructors/[id]` | Yes | Update instructor profile |
| DELETE | `/api/instructors/[id]` | Yes | Deactivate instructor |
| GET | `/api/instructors/[id]/availability` | No | Get available slots |
| POST | `/api/instructors/[id]/availability` | Yes | Add availability slot |
| PUT | `/api/instructors/[id]/availability` | Yes | Update slot |
| DELETE | `/api/instructors/[id]/availability` | Yes | Remove slot |
| GET | `/api/instructors/[id]/reviews` | No | Get instructor reviews |
| GET | `/api/students` | Yes (Admin) | List students |
| POST | `/api/students` | Yes | Create student profile |
| GET | `/api/students/[id]` | Yes | Get student details |
| PUT | `/api/students/[id]` | Yes | Update preferences |
| POST | `/api/matching` | Yes | Run matching for student |
| GET | `/api/bookings` | Yes | List user's bookings |
| POST | `/api/bookings` | Yes | Create booking + payment |
| GET | `/api/bookings/[id]` | Yes | Get booking details |
| PUT | `/api/bookings/[id]` | Yes | Update booking status |
| POST | `/api/bookings/[id]/review` | Yes | Submit review |
| POST | `/api/payments/webhook` | No* | Stripe webhook handler |
| POST | `/api/payments/connect` | Yes | Create Connect account link |
| GET | `/api/messages` | Yes | List conversations |
| POST | `/api/messages` | Yes | Send message |
| GET | `/api/messages/[conversationId]` | Yes | Get conversation messages |
| PUT | `/api/messages/[conversationId]` | Yes | Mark messages as read |
| GET | `/api/progress` | Yes | Get progress entries |
| POST | `/api/progress` | Yes | Log progress |
| GET | `/api/progress/[id]` | Yes | Get specific entry |
| PUT | `/api/progress/[id]` | Yes | Update progress notes |
| GET | `/api/admin/instructors` | Yes (Admin) | Pending verifications |
| PUT | `/api/admin/instructors` | Yes (Admin) | Approve/reject ADI |

*Webhook endpoint uses Stripe signature verification instead of session auth.

---

## 8. Deployment Architecture

### Docker Multi-Stage Build

```
+-------------------+     +------------------+     +------------------+
|  Stage 1: deps    |     | Stage 2: builder |     | Stage 3: runner  |
|  node:22-alpine   |     | node:22-alpine   |     | node:22-alpine   |
|                   |     |                  |     |                  |
|  - npm ci         | --> | - prisma generate| --> | - standalone     |
|  - node_modules   |     | - next build     |     |   output only    |
|                   |     | - .next/         |     | - Non-root user  |
+-------------------+     +------------------+     +------------------+
                                                          |
                                                   Runs as: nextjs:nodejs
                                                   Port: 3000
                                                   CMD: node server.js
```

### Production Stack

```
+------------------+
|  Load Balancer   |
|  (HTTPS term)    |
+------------------+
         |
         v
+------------------+     +------------------+
|  Next.js App     |     |  Next.js App     |
|  (Container)     |     |  (Container)     |
|  Port 3000       |     |  Port 3000       |
+------------------+     +------------------+
         |                        |
         v                        v
+------------------------------------------+
|          PostgreSQL 16                    |
|          (Managed / Container)           |
+------------------------------------------+
```

### Docker Compose (Development)

Services:
- **app:** Next.js application (builds from Dockerfile, port 3000)
- **postgres:** PostgreSQL 16 Alpine (port 5432, persistent volume)

### CI/CD Pipeline (GitHub Actions)

```
[Push/PR] --> [Lint] --> [Type Check] --> [Test] --> [Build]
                                                        |
                                                  [Deploy]*
```

Pipeline stages:
1. **Lint:** `next lint` - ESLint with Next.js config
2. **Type Check:** `tsc --noEmit` - Full TypeScript compilation check
3. **Test:** `jest` - Unit and integration tests
4. **Build:** `next build` - Production build verification

*Deployment stage to be configured per hosting provider.

---

## 9. Security Architecture

### Authentication Security
- Passwords hashed with bcrypt (cost factor: default)
- JWT tokens stored in HTTP-only cookies (not accessible to JavaScript)
- Session secret from environment variable (`NEXTAUTH_SECRET`)
- Token contains: user ID, role (minimal claims)

### API Security
- All mutations require authentication (except public reads and webhooks)
- Role-based access control in route handlers
- Stripe webhook signature verification (`stripe.webhooks.constructEvent`)
- Request body validation with Zod (prevents injection via malformed input)
- CUID identifiers (non-sequential, non-guessable)

### Data Security
- Database credentials via environment variables (never committed)
- Stripe keys separated: publishable (client) vs secret (server only)
- Password requirements: 8+ chars, mixed case, at least one digit
- Messaging gated behind active bookings (privacy protection)

### Infrastructure Security
- Non-root container user (nextjs:nodejs, UID 1001)
- Alpine-based minimal images (reduced attack surface)
- Health checks on database service
- Environment-based configuration (no hardcoded secrets)

---

## 10. Performance Considerations

### Server Components (Default)
All data-fetching pages use React Server Components, meaning:
- No client-side JavaScript bundle for static content
- Database queries run server-side with no waterfall
- Streaming HTML delivery

### Client Components (Opt-in)
Interactive elements marked with `'use client'`:
- Forms and inputs
- Calendar/date picker
- Messaging chat window
- Real-time match filters

### Database Optimization
- Unique indexes on email, userId (profiles), booking+student+instructor composites
- Prisma connection pooling via singleton pattern
- Composite unique index on MatchScore `[studentId, instructorId]` for efficient upserts

### Caching Strategy (Future)
- Match scores cached in database (avoid recalculation)
- Next.js built-in page caching for public instructor profiles
- Static generation for landing page and marketing pages

---

## 11. Error Handling

### API Error Response Format
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes Used
| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET requests, successful mutations |
| 201 | Created | POST that creates a resource |
| 400 | Bad Request | Validation failure (Zod) |
| 401 | Unauthorized | Missing or invalid session |
| 403 | Forbidden | Role insufficient for action |
| 404 | Not Found | Resource does not exist |
| 500 | Internal Error | Unexpected server failure |

### Webhook Error Handling
- Stripe signature verification failure returns 400
- Processing errors return 500 (Stripe will retry)
- Idempotent handling: booking status checks prevent duplicate processing

---

## 12. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `NEXTAUTH_URL` | Yes | Application base URL |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (client-safe) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |

---

## 13. Future Technical Considerations

### Scalability Path
1. **Database:** Move to managed PostgreSQL (e.g., AWS RDS, Supabase) with read replicas
2. **Caching:** Add Redis for session storage and match score caching
3. **Search:** Implement Elasticsearch for instructor search with geo-queries
4. **Real-time:** Add WebSocket support for messaging (Socket.io or Pusher)
5. **CDN:** Static assets and images via CloudFront/Cloudflare

### Monitoring (to add)
- Application Performance Monitoring (Sentry, DataDog)
- Database query monitoring (Prisma Metrics)
- Stripe webhook delivery monitoring
- Error alerting and on-call rotation

### API Versioning
Currently no versioning. When breaking changes are needed:
- Prefix routes with `/api/v2/`
- Maintain backward compatibility on `/api/` for one release cycle
