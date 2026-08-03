# KerbSide - Smart Driving Instructor Marketplace

KerbSide is an intelligent marketplace that connects learner drivers with driving instructors using a smart matching algorithm. The platform considers preferences like location, teaching style, language, car type, and anxiety-friendliness to find the perfect instructor-student match.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials Provider, JWT strategy)
- **Payments**: Stripe Connect (15% platform commission)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Jest + React Testing Library

## Features

- Smart instructor-student matching algorithm (weighted scoring across 8 factors)
- Role-based access (Student, Instructor, Admin)
- Stripe Connect payments with automatic commission splitting
- Real-time messaging between students and instructors
- Booking and availability management
- Progress tracking and skill assessment
- Review and rating system
- ADI (Approved Driving Instructor) verification

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payment processing)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kerbside
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required values in `.env.local`.

4. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/          - Next.js pages and API routes
  components/   - Reusable UI components
  lib/          - Utility functions and service logic
  types/        - TypeScript type definitions
prisma/         - Database schema and migrations
public/         - Static assets
```

## Matching Algorithm

The smart matching engine scores instructors against student preferences using weighted factors:

| Factor | Weight |
|--------|--------|
| Location (postcode) | 25% |
| Gender preference | 15% |
| Language | 15% |
| Teaching style | 15% |
| Car type | 10% |
| Availability overlap | 10% |
| Anxiety-friendly | 5% |
| Specialisms | 5% |

Each factor produces a 0-100 score, and the weighted sum gives an overall match percentage.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## License

Private - All rights reserved.
