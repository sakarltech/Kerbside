# KerbSide

[![CI](https://github.com/your-org/kerbside/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/kerbside/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The UK's smart driving instructor marketplace.** KerbSide connects learner drivers with the right instructor for them using an intelligent matching algorithm that considers location, teaching style, vehicle type, language, and personal preferences.

## Key Features

- **Smart Matching** - Weighted multi-factor scoring algorithm that ranks instructors based on student preferences (location, gender, language, teaching style, car type, anxiety-friendliness, availability)
- **Live Availability** - Instructors manage recurring and one-off availability slots; students book directly into open windows
- **Booking & Payments** - Stripe Connect integration for secure payments with platform commission, automatic refunds on cancellation, and instructor payouts on lesson completion
- **Progress Tracking** - Instructors log student skill progression (1-5 levels) across 20+ driving competencies
- **Messaging** - In-app messaging between students and instructors linked to bookings
- **Instructor Continuity** - If an instructor cancels, the system automatically suggests replacement instructors matched to the student's preferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js |
| Payments | Stripe Connect |
| Styling | Tailwind CSS |
| Testing | Jest + React Testing Library |
| Deployment | Docker / Vercel |

## Architecture Overview

```
Client (Browser)
       |
       v
  Next.js App Router
       |
  +-----------+-------------+
  |           |             |
Pages     API Routes    Server Components
  |           |
  |     +-----+------+
  |     |            |
  |  Services     Validators (Zod)
  |     |
  |  +--+--+--------+----------+
  |  |     |        |          |
  | Matching  Booking  Payment  Notification
  |  Service  Service  Service   Service
  |     |
  |     v
  |   Prisma ORM
  |     |
  |     v
  |  PostgreSQL
  |
  +--- NextAuth.js (Authentication)
  +--- Stripe SDK (Payments)
```

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16+
- Stripe account (for payments)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/kerbside.git
cd kerbside

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL, Stripe keys, etc.

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with sample data
npm run db:seed

# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Seed Data Credentials

After running the seed script, you can log in with any of the seeded accounts:
- **Password for all accounts:** `KerbSide2024!`
- **Admin:** admin@kerbside.co.uk
- **Instructor:** sarah.jones@email.com
- **Student:** emily.clark@email.com

## API Documentation

All API routes require authentication via NextAuth.js session unless noted otherwise.

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/[...nextauth]` | NextAuth.js handlers | No |
| GET | `/api/instructors` | List/search instructors | Yes |
| GET | `/api/instructors/[id]` | Get instructor profile | Yes |
| PUT | `/api/instructors/[id]` | Update instructor profile | Instructor |
| GET | `/api/students/[id]` | Get student profile | Yes |
| PUT | `/api/students/[id]` | Update student profile | Student |
| POST | `/api/matching` | Run matching algorithm | Student |
| GET | `/api/bookings` | List user bookings (paginated) | Yes |
| POST | `/api/bookings` | Create a booking | Student |
| GET | `/api/bookings/[id]` | Get booking details | Participant |
| PUT | `/api/bookings/[id]` | Update booking status | Participant |
| POST | `/api/payments/webhook` | Stripe webhook handler | No (verified) |
| GET | `/api/messages` | List user messages | Yes |
| POST | `/api/messages` | Send a message | Yes |
| GET | `/api/progress/[studentId]` | Get student progress | Participant |
| POST | `/api/progress` | Log progress entry | Instructor |
| GET | `/api/admin/stats` | Platform statistics | Admin |
| GET | `/api/admin/users` | List all users | Admin |

## Smart Matching Algorithm

KerbSide uses a weighted scoring system to match students with the most suitable instructors. Each factor is scored 0-100 and weighted:

| Factor | Weight | Description |
|--------|--------|-------------|
| Location | 25% | Postcode exact/partial match against instructor coverage area |
| Gender | 15% | Instructor gender matches student preference (NO_PREFERENCE = full score) |
| Language | 15% | Intersection of preferred language with instructor's spoken languages |
| Teaching Style | 15% | Exact match = 100, ADAPTIVE instructor = 75, mismatch = 0 |
| Car Type | 10% | BOTH always matches, exact match = 100, mismatch = 0 |
| Availability | 10% | Based on number of slots (5+ = 80, 3+ = 60, fewer = 40) |
| Anxiety-Friendly | 5% | If student needs it and instructor provides it |
| Specialisms | 5% | Instructor versatility based on number of specialisms |

The final score is the weighted sum of all factors, producing a value from 0 to 100.

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key models:

- **User** - Core user account (email, role: STUDENT/INSTRUCTOR/ADMIN)
- **InstructorProfile** - ADI number, specialisms, languages, rates, coverage area
- **StudentProfile** - Preferences for matching (gender, language, style, car type)
- **Availability** - Instructor time slots (recurring or one-off)
- **Booking** - Lesson bookings with payment tracking and status workflow
- **Review** - Post-lesson ratings and comments (1-5 stars)
- **Progress** - Skill progression tracking per student per instructor
- **Message** - In-app messaging between users
- **MatchScore** - Cached matching results for performance

## Deployment

### Docker

The project includes a multi-stage Dockerfile optimised for production:

```bash
# Build and run with Docker Compose
docker compose up -d

# Run database migrations inside the container
docker compose exec app npx prisma migrate deploy

# Seed the database
docker compose exec app npx prisma db seed
```

### Vercel

For Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string (e.g., Supabase, Neon)
   - `NEXTAUTH_URL` - Your production URL
   - `NEXTAUTH_SECRET` - A strong random secret
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret
3. Deploy. Vercel will automatically detect Next.js and build correctly.

Note: Remove `output: "standalone"` from `next.config.js` if deploying to Vercel (Vercel handles this natively).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Application base URL | Yes |
| `NEXTAUTH_SECRET` | JWT signing secret (generate with `openssl rand -base64 32`) | Yes |
| `STRIPE_SECRET_KEY` | Stripe API secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Ensure linting passes (`npm run lint`)
6. Ensure types check (`npm run type-check`)
7. Commit your changes (`git commit -m 'feat: add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

This project is licensed under the MIT License.
