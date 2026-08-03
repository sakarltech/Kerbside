# KerbSide - Data Model Document

## 1. Overview

KerbSide uses PostgreSQL as its primary database, accessed through Prisma ORM. The schema consists of **9 models** and **6 enums** that represent the complete marketplace data layer.

### Entity Relationship Diagram (Text-Based)

```
+--------+       1:1       +--------------------+
|  User  |--------------->| InstructorProfile  |
+--------+                 +--------------------+
    |                            |
    | 1:1                        | 1:N
    v                            v
+----------------+         +---------------+
| StudentProfile |         | Availability  |
+----------------+         +---------------+
    |       |
    | 1:N   | 1:N
    v       v
+----------+  +----------+     +--------+
| Booking  |  | MatchScore|    | Review |
+----------+  +----------+     +--------+
    |              ^                ^
    | 1:1          |                |
    v              |                |
+--------+    (scored by     (one per booking)
| Review |   matching engine)
+--------+

+---------+
| Message |  (between Users, optionally linked to Booking)
+---------+

+----------+
| Progress |  (instructor logs student skill progress)
+----------+
```

### Relationships Summary

```
User 1:1 InstructorProfile
User 1:1 StudentProfile
User 1:N Message (as sender)
User 1:N Message (as receiver)
InstructorProfile 1:N Availability
InstructorProfile 1:N Booking
InstructorProfile 1:N Review
InstructorProfile 1:N Progress
InstructorProfile 1:N MatchScore
StudentProfile 1:N Booking
StudentProfile 1:N Review
StudentProfile 1:N Progress
StudentProfile 1:N MatchScore
Booking 1:1 Review
Booking 1:N Message
MatchScore unique on [studentId, instructorId]
```

---

## 2. Enums

### UserRole
Defines the three user types in the system.

| Value | Description |
|-------|-------------|
| `STUDENT` | Learner driver seeking instruction |
| `INSTRUCTOR` | ADI or PDI offering lessons |
| `ADMIN` | Platform administrator |

### BookingStatus
State machine for booking lifecycle.

| Value | Description |
|-------|-------------|
| `PENDING` | Booking created, awaiting payment confirmation |
| `CONFIRMED` | Payment successful, lesson scheduled |
| `COMPLETED` | Lesson finished, eligible for review |
| `CANCELLED` | Booking cancelled (by student, instructor, or system) |

### Gender
Used for both instructor self-identification and student preference.

| Value | Description |
|-------|-------------|
| `MALE` | Male |
| `FEMALE` | Female |
| `NO_PREFERENCE` | No gender preference (student) / Not specified (instructor) |

### TeachingStyle
Instructor's primary teaching approach and student's preference.

| Value | Description |
|-------|-------------|
| `PATIENT` | Slow-paced, supportive, lots of repetition |
| `INTENSIVE` | Fast-paced, focused on quick progress |
| `STRUCTURED` | Follows a set curriculum with clear milestones |
| `RELAXED` | Informal, conversational approach |
| `ADAPTIVE` | Adapts style to each student's needs |

### CarType
Transmission type for the instruction vehicle.

| Value | Description |
|-------|-------------|
| `MANUAL` | Manual transmission only |
| `AUTOMATIC` | Automatic transmission only |
| `BOTH` | Instructor offers both types |

### LessonFormat
Student's preferred lesson structure.

| Value | Description |
|-------|-------------|
| `HOURLY` | Individual hourly lessons |
| `BLOCK_5` | Block of 5 lessons (prepaid) |
| `BLOCK_10` | Block of 10 lessons (prepaid) |

---

## 3. Models

### 3.1 User

The base authentication model. Every person on the platform has a User record.

**Table name:** `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `email` | String | Unique | Login email address |
| `passwordHash` | String | Required | bcrypt-hashed password |
| `name` | String | Required | Display name |
| `role` | UserRole | Default: STUDENT | User's platform role |
| `phone` | String? | Optional | Contact phone number |
| `createdAt` | DateTime | Auto (now) | Account creation timestamp |
| `updatedAt` | DateTime | Auto (update) | Last modification timestamp |

**Relations:**
- Has one `InstructorProfile` (if role is INSTRUCTOR)
- Has one `StudentProfile` (if role is STUDENT)
- Has many `Message` (as sender)
- Has many `Message` (as receiver)

**Column mappings:** `password_hash`, `created_at`, `updated_at`

---

### 3.2 InstructorProfile

Extended profile for driving instructors with all professional details.

**Table name:** `instructor_profiles`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `userId` | String | Unique, FK -> User | Link to base user |
| `adiNumber` | String? | Optional | 6-digit ADI registration number |
| `adiVerified` | Boolean | Default: false | Whether ADI number has been verified |
| `bio` | String? | Optional | Free-text biography |
| `profilePhoto` | String? | Optional | URL to profile image |
| `specialisms` | String[] | Array | List of specialisms (e.g., motorway, night, refresher) |
| `teachingStyle` | TeachingStyle? | Optional | Primary teaching approach |
| `languages` | String[] | Array | Languages instructor can teach in |
| `carType` | CarType? | Optional | Transmission type offered |
| `gender` | Gender? | Optional | Instructor's gender |
| `anxietyFriendly` | Boolean | Default: false | Whether trained for anxious learners |
| `passRate` | Float? | Optional | Historical pass rate percentage |
| `hourlyRate` | Decimal(10,2)? | Optional | Price per hour in GBP |
| `coveragePostcodes` | String[] | Array | UK postcodes where instructor operates |
| `stripeAccountId` | String? | Optional | Stripe Connect account ID |
| `createdAt` | DateTime | Auto (now) | Profile creation timestamp |
| `updatedAt` | DateTime | Auto (update) | Last modification timestamp |

**Relations:**
- Belongs to one `User` (cascade delete)
- Has many `Availability`
- Has many `Booking` (as instructor)
- Has many `Review` (received reviews)
- Has many `Progress` (logged progress)
- Has many `MatchScore` (match calculations)

**Column mappings:** `user_id`, `adi_number`, `adi_verified`, `profile_photo`, `teaching_style`, `car_type`, `anxiety_friendly`, `pass_rate`, `hourly_rate`, `coverage_postcodes`, `stripe_account_id`, `created_at`, `updated_at`

---

### 3.3 StudentProfile

Extended profile for learner drivers with all matching preferences.

**Table name:** `student_profiles`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `userId` | String | Unique, FK -> User | Link to base user |
| `postcode` | String? | Optional | Student's home/pickup postcode |
| `preferredGender` | Gender? | Optional | Instructor gender preference |
| `preferredLanguage` | String? | Optional | Preferred instruction language |
| `preferredTeachingStyle` | TeachingStyle? | Optional | Preferred teaching approach |
| `preferredCarType` | CarType? | Optional | Preferred transmission type |
| `anxietyFriendly` | Boolean | Default: false | Needs anxiety-friendly instructor |
| `preferredLessonFormat` | LessonFormat? | Optional | Preferred booking structure |
| `pickupFlexibilityKm` | Int | Default: 5 | How far student can travel (km) |
| `goalTimeline` | String? | Optional | When student aims to pass (e.g., "3 months") |
| `availabilityPattern` | String? | Optional | Free-text availability (e.g., "weekday evenings") |
| `createdAt` | DateTime | Auto (now) | Profile creation timestamp |
| `updatedAt` | DateTime | Auto (update) | Last modification timestamp |

**Relations:**
- Belongs to one `User` (cascade delete)
- Has many `Booking` (as student)
- Has many `Review` (reviews given)
- Has many `Progress` (progress entries)
- Has many `MatchScore` (match calculations)

**Column mappings:** `user_id`, `preferred_gender`, `preferred_language`, `preferred_teaching_style`, `preferred_car_type`, `anxiety_friendly`, `preferred_lesson_format`, `pickup_flexibility_km`, `goal_timeline`, `availability_pattern`, `created_at`, `updated_at`

---

### 3.4 Availability

Represents an instructor's available time slots for lessons.

**Table name:** `availabilities`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `instructorId` | String | FK -> InstructorProfile | Owning instructor |
| `dayOfWeek` | Int | 0-6 | Day (0 = Sunday, 6 = Saturday) |
| `startTime` | String | HH:mm format | Slot start time |
| `endTime` | String | HH:mm format | Slot end time |
| `isRecurring` | Boolean | Default: true | Whether slot repeats weekly |
| `specificDate` | DateTime? | Optional | Specific date (for one-off slots) |
| `createdAt` | DateTime | Auto (now) | Creation timestamp |

**Relations:**
- Belongs to one `InstructorProfile` (cascade delete)

**Column mappings:** `instructor_id`, `day_of_week`, `start_time`, `end_time`, `is_recurring`, `specific_date`, `created_at`

---

### 3.5 Booking

Represents a scheduled driving lesson between a student and instructor.

**Table name:** `bookings`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `studentId` | String | FK -> StudentProfile | Booking student |
| `instructorId` | String | FK -> InstructorProfile | Assigned instructor |
| `dateTime` | DateTime | Required | Lesson date and start time |
| `durationMinutes` | Int | Required | Lesson length (30-180) |
| `status` | BookingStatus | Default: PENDING | Current booking state |
| `amount` | Decimal(10,2) | Required | Total lesson price in GBP |
| `commission` | Decimal(10,2) | Required | Platform commission in GBP |
| `paymentIntentId` | String? | Optional | Stripe PaymentIntent ID |
| `stripeTransferId` | String? | Optional | Stripe Transfer ID |
| `notes` | String? | Optional | Student notes for the lesson |
| `createdAt` | DateTime | Auto (now) | Booking creation timestamp |
| `updatedAt` | DateTime | Auto (update) | Last status change timestamp |

**Relations:**
- Belongs to one `StudentProfile` (cascade delete)
- Belongs to one `InstructorProfile` (cascade delete)
- Has one `Review` (optional, after completion)
- Has many `Message` (conversation tied to booking)

**Column mappings:** `student_id`, `instructor_id`, `date_time`, `duration_minutes`, `payment_intent_id`, `stripe_transfer_id`, `created_at`, `updated_at`

---

### 3.6 Review

Post-lesson review from a student about an instructor. One review per booking.

**Table name:** `reviews`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `bookingId` | String | Unique, FK -> Booking | Associated booking |
| `studentId` | String | FK -> StudentProfile | Review author |
| `instructorId` | String | FK -> InstructorProfile | Reviewed instructor |
| `rating` | Int | 1-5 | Star rating |
| `comment` | String? | Optional | Written review text |
| `createdAt` | DateTime | Auto (now) | Review submission timestamp |

**Relations:**
- Belongs to one `Booking` (cascade delete, unique)
- Belongs to one `StudentProfile` (cascade delete)
- Belongs to one `InstructorProfile` (cascade delete)

**Constraints:**
- Unique on `bookingId` (one review per booking)

**Column mappings:** `booking_id`, `student_id`, `instructor_id`, `created_at`

---

### 3.7 Progress

Instructor-logged skill progression entries for a student.

**Table name:** `progress_entries`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `studentId` | String | FK -> StudentProfile | Student being assessed |
| `instructorId` | String | FK -> InstructorProfile | Instructor logging progress |
| `skillName` | String | Required | Name of the skill (e.g., "Parallel Parking") |
| `level` | Int | 1-5 | Current competency level |
| `notes` | String? | Optional | Instructor's notes on progress |
| `date` | DateTime | Default: now | Date of assessment |
| `createdAt` | DateTime | Auto (now) | Record creation timestamp |

**Relations:**
- Belongs to one `StudentProfile` (cascade delete)
- Belongs to one `InstructorProfile` (cascade delete)

**Column mappings:** `student_id`, `instructor_id`, `skill_name`, `created_at`

**Skill Level Scale:**
| Level | Meaning |
|-------|---------|
| 1 | Introduced - first exposure to the skill |
| 2 | Developing - needs significant guidance |
| 3 | Competent - can perform with minor prompts |
| 4 | Proficient - consistent execution |
| 5 | Mastered - test-ready standard |

---

### 3.8 Message

In-app messaging between users, optionally linked to a booking.

**Table name:** `messages`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `senderId` | String | FK -> User | Message sender |
| `receiverId` | String | FK -> User | Message recipient |
| `bookingId` | String? | FK -> Booking, Optional | Associated booking (privacy gate) |
| `content` | String | Required | Message text (max 2000 chars) |
| `read` | Boolean | Default: false | Whether recipient has read it |
| `createdAt` | DateTime | Auto (now) | Send timestamp |

**Relations:**
- Belongs to one `User` (sender, cascade delete)
- Belongs to one `User` (receiver, cascade delete)
- Belongs to one `Booking` (optional, set null on delete)

**Column mappings:** `sender_id`, `receiver_id`, `booking_id`, `created_at`

**Privacy Rule:** Messages can only be sent between users who share an active (PENDING, CONFIRMED, or COMPLETED) booking. This is enforced at the API layer.

---

### 3.9 MatchScore

Cached results of the matching algorithm. Stores the breakdown of how well an instructor matches a student.

**Table name:** `match_scores`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String | PK, CUID | Unique identifier |
| `studentId` | String | FK -> StudentProfile | Student being matched |
| `instructorId` | String | FK -> InstructorProfile | Instructor being scored |
| `overallScore` | Float | Required | Weighted total (0-100) |
| `locationScore` | Float | Required | Location factor (0-100) |
| `genderScore` | Float | Required | Gender factor (0-100) |
| `languageScore` | Float | Required | Language factor (0-100) |
| `styleScore` | Float | Required | Teaching style factor (0-100) |
| `carScore` | Float | Required | Car type factor (0-100) |
| `availabilityScore` | Float | Required | Availability factor (0-100) |
| `anxietyScore` | Float | Required | Anxiety-friendly factor (0-100) |
| `specialismScore` | Float | Required | Specialism factor (0-100) |
| `createdAt` | DateTime | Auto (now) | Calculation timestamp |

**Relations:**
- Belongs to one `StudentProfile` (cascade delete)
- Belongs to one `InstructorProfile` (cascade delete)

**Constraints:**
- Unique composite index on `[studentId, instructorId]` (one score per pair)

**Column mappings:** `student_id`, `instructor_id`, `overall_score`, `location_score`, `gender_score`, `language_score`, `style_score`, `car_score`, `availability_score`, `anxiety_score`, `specialism_score`, `created_at`

---

## 4. Matching Algorithm Scoring Breakdown

### Weight Distribution

```
Total = 1.00

Location:      ||||||||||||||||||||||||| 0.25 (25%)
Gender:        ||||||||||||||| 0.15 (15%)
Language:      ||||||||||||||| 0.15 (15%)
Style:         ||||||||||||||| 0.15 (15%)
Car Type:      |||||||||| 0.10 (10%)
Availability:  |||||||||| 0.10 (10%)
Anxiety:       ||||| 0.05 (5%)
Specialism:    ||||| 0.05 (5%)
```

### Factor Scoring Logic

#### Location Score (Weight: 0.25)
```
Input: student.postcode vs instructor.coveragePostcodes[]

IF student has no postcode OR instructor has no coverage areas:
  RETURN 0

Normalize: strip whitespace, uppercase

IF exact postcode match in instructor's list:
  RETURN 100

IF first 3 characters of student postcode match any instructor postcode prefix:
  RETURN 50

RETURN 0
```

#### Gender Score (Weight: 0.15)
```
Input: student.preferredGender vs instructor.gender

IF student has no preference OR preference is NO_PREFERENCE:
  RETURN 100

IF instructor gender is unknown:
  RETURN 50

IF student preference matches instructor gender:
  RETURN 100

RETURN 0
```

#### Language Score (Weight: 0.15)
```
Input: student.preferredLanguage vs instructor.languages[]

IF student has no preference OR instructor has no languages listed:
  RETURN 50

IF student's preferred language is in instructor's language list (case-insensitive):
  RETURN 100

RETURN 0
```

#### Teaching Style Score (Weight: 0.15)
```
Input: student.preferredTeachingStyle vs instructor.teachingStyle

IF student has no preference:
  RETURN 100

IF instructor has no style set:
  RETURN 50

IF exact match:
  RETURN 100

IF instructor style is ADAPTIVE:
  RETURN 75

RETURN 0
```

#### Car Type Score (Weight: 0.10)
```
Input: student.preferredCarType vs instructor.carType

IF student has no preference:
  RETURN 100

IF instructor has no car type set:
  RETURN 50

IF instructor offers BOTH:
  RETURN 100

IF exact match:
  RETURN 100

RETURN 0
```

#### Availability Score (Weight: 0.10)
```
Input: student.availabilityPattern (free text) vs instructor.availability[] (structured slots)

IF no student pattern OR no instructor slots:
  RETURN 50

Parse pattern for keywords:
  - Day preferences: weekday, weekend, mon-fri, sat/sun
  - Time preferences: morning/am, afternoon, evening/pm/night

IF no recognizable keywords in pattern:
  IF instructor has 5+ slots: RETURN 80
  IF instructor has 3+ slots: RETURN 60
  RETURN 40

Filter instructor slots matching both day AND time preferences
Count matching slots:
  0 matching: RETURN 10
  1 matching: RETURN 40
  2 matching: RETURN 60
  3-4 matching: RETURN 80
  5+ matching: RETURN 100
```

#### Anxiety-Friendly Score (Weight: 0.05)
```
Input: student.anxietyFriendly vs instructor.anxietyFriendly

IF student does NOT need anxiety-friendly:
  RETURN 100

IF instructor IS anxiety-friendly:
  RETURN 100

RETURN 0
```

#### Specialism Score (Weight: 0.05)
```
Input: instructor.specialisms[]

IF 0 specialisms: RETURN 50
IF 1-2 specialisms: RETURN 75
IF 3+ specialisms: RETURN 100
```

### Overall Score Calculation
```
overallScore = (locationScore * 0.25) +
               (genderScore * 0.15) +
               (languageScore * 0.15) +
               (styleScore * 0.15) +
               (carScore * 0.10) +
               (availabilityScore * 0.10) +
               (anxietyScore * 0.05) +
               (specialismScore * 0.05)

Result: rounded to 2 decimal places, range 0.00 - 100.00
```

---

## 5. Booking State Machine

```
                    +----------+
                    | PENDING  |
                    +----------+
                   /            \
    payment_intent.succeeded    payment_intent.failed
    OR manual confirm           OR student cancels
                 /                \
                v                  v
         +-----------+      +-----------+
         | CONFIRMED |      | CANCELLED |
         +-----------+      +-----------+
              |                    ^
              | lesson completed   | instructor cancels
              | OR admin marks     | (triggers continuity)
              v                    |
         +-----------+            /
         | COMPLETED |----------+
         +-----------+    (cannot cancel
              |            after completion)
              v
         +---------+
         | REVIEW  | (eligible for review submission)
         +---------+
```

### State Transitions

| From | To | Trigger | Side Effects |
|------|----|---------|-------------|
| PENDING | CONFIRMED | `payment_intent.succeeded` webhook | Notification sent to both parties |
| PENDING | CANCELLED | Payment failure or student cancels | Refund if payment captured |
| CONFIRMED | COMPLETED | Instructor marks complete or time passes | Eligible for review, progress logging |
| CONFIRMED | CANCELLED | Student or instructor cancels | Full refund processed; if instructor cancels, continuity service triggers replacement search |
| COMPLETED | - | Terminal state | Review can be submitted |
| CANCELLED | - | Terminal state | No further transitions |

### Cancellation & Continuity Logic

When an instructor cancels a CONFIRMED booking:
1. Booking status set to CANCELLED
2. Full refund processed via Stripe
3. Student notified of cancellation
4. Matching engine re-runs for the student (excluding cancelled instructor)
5. Top 5 replacement instructors suggested to student via notification
6. Student can rebook with a suggested replacement

---

## 6. Indexes & Constraints

### Unique Constraints
| Table | Column(s) | Purpose |
|-------|-----------|---------|
| users | email | Prevent duplicate accounts |
| instructor_profiles | user_id | One profile per user |
| student_profiles | user_id | One profile per user |
| reviews | booking_id | One review per booking |
| match_scores | [student_id, instructor_id] | One score per student-instructor pair |

### Implicit Indexes (Prisma)
Prisma automatically creates indexes on:
- All `@id` fields (primary key)
- All `@unique` fields
- All `@@unique` composite fields
- All foreign key fields (relation fields)

### Recommended Additional Indexes (Production)
| Table | Column(s) | Type | Reason |
|-------|-----------|------|--------|
| bookings | [student_id, status] | Composite | Dashboard queries filter by status |
| bookings | [instructor_id, date_time] | Composite | Calendar view queries |
| messages | [sender_id, receiver_id, created_at] | Composite | Conversation listing |
| match_scores | [student_id, overall_score DESC] | Composite | Top matches query |
| availabilities | [instructor_id, day_of_week] | Composite | Slot lookup |
| progress_entries | [student_id, skill_name] | Composite | Progress dashboard |

---

## 7. Data Validation Rules

### At Application Layer (Zod Schemas)

| Field | Validation |
|-------|-----------|
| email | Valid email format |
| password | Min 8 chars, 1 uppercase, 1 lowercase, 1 digit |
| name | Min 2 characters |
| adiNumber | Exactly 6 digits |
| bio | Max 500 characters |
| hourlyRate | Min 20, max 100 |
| coveragePostcodes | Min 1 entry |
| languages | Min 1 entry |
| postcode | Min 5 characters |
| durationMinutes | Min 30, max 180 |
| rating | Integer 1-5 |
| comment (review) | Max 1000 characters |
| message content | Min 1, max 2000 characters |
| startTime/endTime | HH:mm format (regex validated) |
| dayOfWeek | Integer 0-6 |
| pickupFlexibilityKm | Min 1, max 30 |

### At Database Layer (Prisma/PostgreSQL)
- Foreign key constraints with CASCADE delete
- Decimal precision (10,2) for monetary amounts
- Boolean defaults (false for verification flags)
- DateTime defaults (now() for timestamps)
- @updatedAt for automatic timestamp on modifications

---

## 8. Seed Data Structure

The development seed (`prisma/seed.ts`) creates:

- **5 Instructors:** Varied across gender, languages, teaching styles, car types, locations (London, Manchester, Birmingham, Leeds, Edinburgh)
- **5 Students:** Varied preferences covering all matching dimensions
- **10 Availability slots:** Distributed across instructors with different day/time patterns
- **3 Bookings:** In PENDING, CONFIRMED, and COMPLETED states
- **2 Reviews:** For completed bookings
- **5 Progress entries:** Demonstrating skill tracking across multiple skills
- **3 Messages:** Showing conversation patterns

This provides a realistic starting dataset for development and testing.
