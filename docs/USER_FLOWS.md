# KerbSide - User Flows Document

## 1. Instructor Onboarding Flow

### Overview
A driving instructor signs up, creates their profile, sets availability, and connects their Stripe account to receive payments.

### Step-by-Step Flow

```
[Landing Page] --> [Choose "I'm an Instructor"] --> [Registration Form]
     |
     v
[Multi-Step Registration]
  Step 1: Account Details
  Step 2: Professional Info
  Step 3: Profile Setup
  Step 4: Availability
  Step 5: Stripe Connect
     |
     v
[Dashboard - Profile Complete]
```

### Detailed Steps

**Step 1: Account Details**
1. Instructor clicks "Sign Up as Instructor" on landing page
2. Enters email, password, name, phone number
3. Password validated (8+ chars, mixed case, digit)
4. System creates User record with role = INSTRUCTOR
5. System creates empty InstructorProfile linked to User

**Step 2: Professional Information**
1. Enters 6-digit ADI number
2. Selects teaching style (Patient, Intensive, Structured, Relaxed, Adaptive)
3. Selects car type (Manual, Automatic, Both)
4. Enters hourly rate (GBP 20-100)
5. ADI number stored; verification status set to pending (adiVerified = false)

**Step 3: Profile Setup**
1. Writes bio (max 500 characters)
2. Selects gender
3. Adds languages spoken (minimum 1)
4. Adds specialisms (motorway, night driving, refresher, intensive, nervous drivers, etc.)
5. Checks anxiety-friendly if applicable
6. Enters coverage postcodes (minimum 1)
7. Optionally uploads profile photo

**Step 4: Availability Setup**
1. Sees weekly calendar grid (Mon-Sun, 06:00-21:00)
2. Clicks/taps to add available time slots
3. For each slot: selects day, start time, end time
4. Marks slots as recurring (weekly) or one-off
5. Can add multiple slots per day
6. Minimum of one slot required to go live

**Step 5: Stripe Connect Onboarding**
1. System calls `POST /api/payments/connect` to create Express account
2. Instructor redirected to Stripe's hosted onboarding
3. Completes KYC (identity, bank details) on Stripe
4. Redirected back to KerbSide on completion
5. `stripeAccountId` stored on InstructorProfile
6. Profile now active and visible to students

### Post-Registration
- Profile visible in student search results
- Can receive match requests
- Dashboard shows empty bookings, zero earnings
- Admin can verify ADI number (manual process)
- Verified badge shown on profile once approved

### Error States
- Duplicate email: "An account with this email already exists"
- Invalid ADI format: "ADI number must be exactly 6 digits"
- Stripe onboarding abandoned: Profile created but payments disabled until Stripe setup completed
- Stripe account creation fails: Retry option shown, profile still functional for non-paid features

---

## 2. Student Registration Flow

### Overview
A learner driver signs up and completes their preference profile, which feeds into the matching algorithm.

### Step-by-Step Flow

```
[Landing Page] --> [Choose "I'm a Learner"] --> [Registration Form]
     |
     v
[Registration with Preferences]
  - Account details
  - Location
  - Instructor preferences
  - Lesson preferences
     |
     v
[Dashboard - View Matches]
```

### Detailed Steps

**Account Creation**
1. Student clicks "Find My Instructor" on landing page
2. Enters email, password, name, phone (optional)
3. System creates User with role = STUDENT
4. System creates StudentProfile linked to User

**Preference Setup**
1. **Location:** Enters home/pickup postcode (used for matching)
2. **Gender preference:** Male, Female, or No Preference
3. **Language:** Preferred instruction language (e.g., English, Urdu, Polish)
4. **Teaching style:** Patient, Intensive, Structured, Relaxed, or no preference
5. **Car type:** Manual, Automatic, or no preference
6. **Anxiety-friendly:** Toggle if needs anxiety-specialised instructor
7. **Lesson format:** Hourly, Block of 5, or Block of 10
8. **Pickup flexibility:** How far willing to travel (1-30 km, default 5)
9. **Goal timeline:** Free text (e.g., "Pass in 3 months")
10. **Availability pattern:** Free text (e.g., "Weekday evenings after 5pm")

**After Registration**
1. System immediately runs matching algorithm
2. Student redirected to dashboard showing top matched instructors
3. Each match shows compatibility score and factor breakdown
4. Student can browse, filter, and book directly

### Error States
- Duplicate email: "An account with this email already exists"
- Invalid postcode: "Please enter a valid UK postcode"
- No preferences set: Matching still works but returns broader results (neutral scores)

---

## 3. Smart Matching Flow

### Overview
The matching engine scores all available instructors against a student's preferences and returns ranked results.

### Step-by-Step Flow

```
[Student Dashboard] --> [Click "Find Matches" or auto-trigger]
     |
     v
[Matching Engine Executes]
  1. Load student preferences
  2. Load all instructor profiles + availability
  3. Score each instructor (8 factors)
  4. Sort by overall score
  5. Return top 10
     |
     v
[Match Results Page]
  - Ranked instructor cards
  - Overall compatibility %
  - Factor breakdown per instructor
  - Filter/sort controls
     |
     v
[Student clicks instructor] --> [Public Profile] --> [Book]
```

### Detailed Steps

**Trigger**
1. Automatic: After registration (first-time matches)
2. Manual: Student clicks "Refresh Matches" on dashboard
3. API: `POST /api/matching` with student ID

**Algorithm Execution**
1. Load student's StudentProfile (preferences)
2. Query all InstructorProfile records with their Availability slots
3. For each instructor, calculate 8 factor scores (0-100 each)
4. Multiply each factor score by its weight
5. Sum weighted scores for overall score (0-100)
6. Round to 2 decimal places
7. Sort results by overallScore descending
8. Return top 10 (configurable limit)

**Results Display**
1. Each result shows:
   - Instructor name and photo
   - Overall match percentage
   - Per-factor scores (visual breakdown)
   - Key info: hourly rate, car type, languages
   - "View Profile" and "Book Now" buttons
2. Factors are shown as colored bars or tags
3. Student can filter results by:
   - Maximum price
   - Minimum rating
   - Specific availability days
   - Verified only

**Score Caching**
1. After calculation, scores are stored in MatchScore table
2. Upsert: if score exists for this student+instructor pair, update it
3. Dashboard can show cached scores without recalculation
4. Scores refreshed on demand or when student updates preferences

### Edge Cases
- No instructors in area: Show message "No instructors found in your area yet"
- All scores very low: Show results anyway with "Consider expanding your preferences" hint
- Student has no preferences: All factors return neutral (50-100), location becomes primary differentiator

---

## 4. Booking Flow

### Overview
A student selects an instructor, picks a time slot, and completes payment to book a lesson.

### Step-by-Step Flow

```
[Instructor Profile] --> [Click "Book Lesson"]
     |
     v
[Select Date & Time]
  - View available slots
  - Pick one
     |
     v
[Confirm Details]
  - Duration (default 60 min)
  - Price shown (hourly rate * duration)
  - Add notes (optional)
     |
     v
[Payment]
  - Stripe payment form
  - Card details
  - Confirm payment
     |
     v
[Booking Confirmed]
  - Confirmation shown
  - Email sent to both parties
  - Booking appears in dashboard
```

### Detailed Steps

**Slot Selection**
1. Student views instructor's public profile
2. Clicks "Book a Lesson" button
3. Redirected to booking page (`/booking/[instructorId]`)
4. Sees calendar view of instructor's available slots
5. Selects a specific date and time slot
6. Recurring slots show as available on their respective days

**Booking Details**
1. System shows selected:
   - Instructor name and photo
   - Date and time
   - Duration selector (30, 60, 90, 120, 180 minutes)
2. Price calculated: `hourlyRate * (duration / 60)`
3. Commission calculated: `price * 0.15`
4. Student sees total price (instructor receives 85%)
5. Optional: add notes for the lesson ("Practice roundabouts please")

**Payment Processing**
1. `POST /api/bookings` called with:
   - instructorId, dateTime, durationMinutes, notes
2. Server validates:
   - Student is authenticated
   - Instructor exists and has Stripe account
   - Time slot is available (not already booked)
3. Server creates PaymentIntent via Stripe:
   - Amount in pence
   - `application_fee_amount` (15% commission)
   - `transfer_data.destination` = instructor's Stripe account
4. Returns `clientSecret` to frontend
5. Student enters card details in Stripe Elements form
6. Student confirms payment

**Payment Confirmation**
1. Stripe processes payment
2. Webhook fires: `payment_intent.succeeded`
3. Server updates booking status: PENDING -> CONFIRMED
4. Notification sent to instructor (new booking)
5. Notification sent to student (booking confirmed)
6. Both see booking in their dashboards

### Error States
- Slot already booked: "This time slot is no longer available"
- Payment declined: "Payment failed. Please try another card."
- Instructor has no Stripe account: "This instructor cannot accept payments yet"
- Lesson too short/long: Zod validation error (30-180 min range)

---

## 5. Payment Processing Flow

### Overview
Payment processing uses Stripe Connect destination charges with automatic splitting between platform and instructor.

### Complete Payment Lifecycle

```
[Student Books] --> [PaymentIntent Created] --> [Student Pays]
     |
     | payment_intent.succeeded (webhook)
     v
[Booking CONFIRMED]
     |
     | Lesson occurs...
     v
[Instructor marks COMPLETED]
     |
     | Funds already transferred via destination charge
     v
[Instructor receives 85%]
[Platform retains 15%]
```

### Detailed Steps

**Payment Creation**
1. Booking service calculates amount in pence (GBP smallest unit)
2. Calls `stripe.paymentIntents.create()` with:
   - `amount`: total in pence
   - `currency`: "gbp"
   - `application_fee_amount`: 15% of total (in pence)
   - `transfer_data.destination`: instructor's Stripe account ID
3. Returns `client_secret` to the frontend

**Payment Capture**
1. Frontend uses Stripe Elements to collect card
2. `stripe.confirmPayment()` called with client_secret
3. Stripe charges the student's card
4. Stripe automatically splits:
   - 85% to instructor's connected account
   - 15% to platform's Stripe account (as application fee)

**Webhook Handling**
1. Stripe sends `payment_intent.succeeded` to `/api/payments/webhook`
2. Server verifies webhook signature
3. Looks up booking by `paymentIntentId`
4. Updates booking status to CONFIRMED
5. Returns 200 to Stripe

**Refund Processing (on cancellation)**
1. Booking service calls `stripe.refunds.create({ payment_intent: id })`
2. Full refund issued to student
3. Instructor's pending transfer is reversed
4. Platform fee is also reversed

**Instructor Payout**
- Stripe handles payouts to instructor's bank on their configured schedule
- Instructor can view balance via dashboard (calls Stripe Balance API)
- Platform does not manually transfer funds (destination charges handle this)

---

## 6. Review Submission Flow

### Overview
After a lesson is completed, the student can leave a verified review for the instructor.

### Step-by-Step Flow

```
[Booking COMPLETED] --> [Review prompt shown on dashboard]
     |
     v
[Student clicks "Leave Review"]
     |
     v
[Review Form]
  - Star rating (1-5)
  - Written comment (optional, max 1000 chars)
     |
     v
[Submit Review]
  - Stored with booking link
  - Appears on instructor profile
  - Updates instructor average rating
```

### Detailed Steps

**Eligibility Check**
1. Only COMPLETED bookings are eligible for review
2. Only one review per booking (unique constraint)
3. Only the booking's student can submit the review
4. No time limit on review submission (can review later)

**Review Submission**
1. Student navigates to completed booking or clicks "Leave Review" prompt
2. Selects star rating (1-5, required)
3. Writes comment (optional, max 1000 chars)
4. Clicks "Submit Review"
5. `POST /api/bookings/[id]/review` with rating and comment

**Server Processing**
1. Validates user is authenticated and is the booking's student
2. Validates booking exists and status is COMPLETED
3. Validates no existing review for this booking
4. Creates Review record linked to booking, student, and instructor
5. Returns success

**Display**
1. Review appears on instructor's public profile
2. Instructor's average rating recalculated
3. Review shows on student's booking history
4. All reviews show "Verified" badge (tied to real booking)

### Verification Guarantee
- Reviews can only exist for completed bookings
- No anonymous reviews
- No reviews without an actual lesson
- This prevents fake/spam reviews entirely

---

## 7. Student Progress Tracking Flow

### Overview
Instructors log student skill progress after each lesson, building a visual skill tree and lesson history.

### Step-by-Step Flow

```
[Instructor completes lesson] --> [Log Progress button]
     |
     v
[Progress Entry Form]
  - Skill name (from list or custom)
  - Level (1-5)
  - Notes
     |
     v
[Saved] --> [Visible on student dashboard]
```

### Detailed Steps

**Instructor Logs Progress**
1. After marking a booking as COMPLETED
2. Instructor navigates to the student's progress section
3. Clicks "Log Progress" or "Update Skills"
4. Selects skill from predefined list or enters custom:
   - Moving Off & Stopping
   - Steering Control
   - Use of Mirrors
   - Signalling
   - Junctions (turning left/right)
   - Roundabouts
   - Pedestrian Crossings
   - Dual Carriageways
   - Parallel Parking
   - Bay Parking
   - Emergency Stop
   - Independent Driving
5. Sets level (1-5):
   - 1: Introduced
   - 2: Developing
   - 3: Competent
   - 4: Proficient
   - 5: Mastered
6. Adds notes: "Good improvement on roundabouts today, needs more practice on spiral roundabouts"
7. Submits via `POST /api/progress`

**Student Views Progress**
1. Student opens Progress page on their dashboard
2. Sees skill chart showing all tracked skills and their levels
3. Visual progress bars for each skill (1-5 scale)
4. Lesson log showing chronological history:
   - Date
   - Skills covered
   - Level changes
   - Instructor notes
5. Can filter by skill name or date range
6. Overall progress percentage shown (skills at level 4-5 / total skills)

**Multiple Instructors**
- If student has worked with multiple instructors, all progress is aggregated
- Each entry shows which instructor logged it
- Ensures continuity if instructor changes

---

## 8. In-App Messaging Flow

### Overview
Students and instructors can message each other, but only when they share an active booking (privacy gate).

### Step-by-Step Flow

```
[Active booking exists] --> [Messaging unlocked]
     |
     v
[Messages page]
  - Conversation list (left panel)
  - Chat window (right panel)
     |
     v
[Type and send message]
  - Real-time display (refresh-based)
  - Read receipts
```

### Detailed Steps

**Accessing Messages**
1. User navigates to `/dashboard/messages`
2. Left panel shows list of conversations
3. Each conversation shows:
   - Other person's name
   - Last message preview
   - Unread count badge
   - Time of last message

**Privacy Gate**
1. Before sending first message, system checks:
   - Does an active booking exist between these two users?
   - Active = PENDING, CONFIRMED, or COMPLETED status
2. If no booking: messaging is not available
3. Message includes optional `bookingId` link

**Sending a Message**
1. User selects a conversation or starts new one
2. Types message (min 1 char, max 2000 chars)
3. Clicks send
4. `POST /api/messages` with receiverId, content, bookingId
5. Message stored with `read: false`
6. Appears in both users' conversation views

**Reading Messages**
1. User opens a conversation
2. `GET /api/messages/[conversationId]` returns all messages
3. Messages displayed chronologically
4. `PUT /api/messages/[conversationId]` marks unread messages as read
5. Sender can see read status update on refresh

**Use Cases**
- Student: "Hi, I'll be waiting outside the Tesco on High Street"
- Instructor: "Running 5 minutes late, traffic on the A40"
- Student: "Can we focus on parallel parking next lesson?"
- Instructor: "Great lesson today! Practice your mirror checks before next time"

### Limitations (MVP)
- No real-time push (polling/refresh only)
- No file/image attachments
- No typing indicators
- No group conversations
- Messages persist indefinitely (no auto-delete)

---

## 9. Cancellation & Instructor Continuity Flow

### Overview
When an instructor cancels a confirmed booking, the system automatically suggests replacement instructors to the student based on their preferences.

### Step-by-Step Flow

```
[Instructor cancels booking]
     |
     v
[System processes cancellation]
  - Status -> CANCELLED
  - Refund initiated
  - Student notified
     |
     v
[Continuity Engine triggered]
  - Re-run matching (exclude cancelled instructor)
  - Find top 5 replacements
  - Send suggestions to student
     |
     v
[Student receives replacement suggestions]
  - Can book one of them
  - Or search on their own
```

### Detailed Steps

**Cancellation Trigger**
1. Instructor opens their bookings page
2. Selects a CONFIRMED booking
3. Clicks "Cancel Booking"
4. Confirms cancellation

**Server Processing**
1. `PUT /api/bookings/[id]` with status: CANCELLED and cancelling user ID
2. BookingService.cancelBooking() executes:
   a. Verifies booking exists and is in CONFIRMED state
   b. If paymentIntentId exists: processes full refund via Stripe
   c. Updates booking status to CANCELLED
   d. Sends notification to student
   e. Detects that cancellation is by the instructor (not student)
   f. Triggers `findReplacementInstructor(bookingId)`

**Replacement Search**
1. Load the cancelled booking details (student, original instructor, time)
2. Run matching engine for the student (same preferences)
3. Exclude the instructor who cancelled from results
4. Take top 5 results
5. Send replacement suggestions to student via notification

**Student Experience**
1. Receives notification: "Your instructor [Name] has cancelled your lesson on [Date]"
2. Sees suggested replacements with match scores
3. Each suggestion shows:
   - Instructor name and match %
   - Available times near the original booking time
   - "Book with [Name]" button
4. Student can:
   - Book one of the suggestions
   - Search for other instructors themselves
   - Choose not to rebook

**Student Cancels (Different Path)**
1. If student cancels: full refund processed
2. No continuity engine triggered
3. Simple cancellation notification to instructor
4. No replacement search needed

### Edge Cases
- No suitable replacements found: Student notified with "We couldn't find a match, try searching manually"
- Student's preferences have changed since original booking: Uses current preferences, not original
- Instructor cancels multiple bookings: Each triggers its own replacement search
- Very short notice cancellation: Same flow, but replacement may not have availability

---

## 10. Admin ADI Verification Flow

### Overview
Platform administrators can review and verify instructor ADI numbers, granting a "Verified" badge.

### Step-by-Step Flow

```
[Instructor submits ADI number during registration]
     |
     v
[Stored with adiVerified = false]
     |
     v
[Admin reviews pending verifications]
  - GET /api/admin/instructors (pending list)
     |
     v
[Admin approves or rejects]
  - PUT /api/admin/instructors (approve/reject)
     |
     v
[Instructor profile updated]
  - adiVerified = true (if approved)
  - Verified badge visible on profile
```

### Detailed Steps

**Submission**
1. Instructor enters 6-digit ADI number during registration
2. Format validated (regex: exactly 6 digits)
3. Stored on InstructorProfile with `adiVerified = false`

**Admin Review**
1. Admin logs in (role = ADMIN)
2. Navigates to admin dashboard
3. Views list of instructors pending verification
4. Each entry shows:
   - Instructor name and email
   - ADI number submitted
   - Registration date
   - Profile completeness

**Verification Decision**
1. Admin reviews ADI number against DVSA records (manual check at MVP)
2. Clicks "Approve" or "Reject"
3. `PUT /api/admin/instructors` with instructorId and decision
4. If approved: `adiVerified = true`, verified badge appears
5. If rejected: Instructor notified to resubmit

**Impact of Verification**
- Verified instructors appear higher in search results (trust signal)
- "Verified" badge shown on public profile
- Students can filter for verified-only instructors
- Unverified instructors can still operate (moderate verification level)

---

## 11. End-to-End Journey: First-Time Student

This combines multiple flows into a complete user journey.

```
Day 1: Discovery
  1. Student finds KerbSide via search/social
  2. Lands on homepage
  3. Reads value proposition and "How it Works"
  4. Clicks "Find My Instructor"

Day 1: Registration (5 minutes)
  5. Creates account (email, password, name)
  6. Enters postcode (SW1A 1AA)
  7. Sets preferences:
     - Female instructor (anxiety reasons)
     - Patient teaching style
     - Automatic car
     - Anxiety-friendly: Yes
     - Availability: Weekday mornings
     - Goal: Pass in 6 months
  8. Submits profile

Day 1: Matching (instant)
  9. Matching engine runs
  10. Top 10 instructors shown with scores
  11. #1 match: "Priya" - 87% compatibility
      - Location: 100 (same postcode area)
      - Gender: 100 (female match)
      - Style: 100 (Patient match)
      - Car: 100 (Automatic)
      - Anxiety: 100 (anxiety-friendly)

Day 1: Booking (3 minutes)
  12. Student clicks "View Profile" on Priya
  13. Reads bio, reviews, pass rate
  14. Clicks "Book a Lesson"
  15. Selects Tuesday 10:00-11:00
  16. Duration: 60 minutes
  17. Price shown: GBP 35
  18. Enters card details
  19. Confirms payment
  20. Booking confirmed!

Day 3: Lesson
  21. Student receives reminder notification
  22. Messages instructor: "I'll be at 42 Oak Road"
  23. Instructor confirms pickup
  24. Lesson takes place

Day 3: After Lesson
  25. Instructor marks booking as COMPLETED
  26. Instructor logs progress:
      - Moving Off & Stopping: Level 2
      - Steering Control: Level 1
      - Notes: "Great first lesson, very nervous initially
        but settled in well. Focus on mirror checks."
  27. Student sees progress update on dashboard

Day 4: Review
  28. Student leaves review:
      - Rating: 5 stars
      - Comment: "Priya was so patient and understanding.
        I felt safe the whole time."
  29. Review appears on Priya's profile (verified badge)

Day 7: Rebooking
  30. Student books next lesson with same instructor
  31. Pattern continues weekly
  32. Progress tracked over time
  33. Skills gradually improve from Level 1 to Level 5
```

---

## 12. Flow Summary Table

| Flow | Primary Actor | Trigger | End State |
|------|--------------|---------|-----------|
| Instructor Onboarding | Instructor | Click "Sign Up as Instructor" | Profile live, payments enabled |
| Student Registration | Student | Click "Find My Instructor" | Preferences saved, matches shown |
| Smart Matching | System | Registration or manual refresh | Ranked results displayed |
| Booking | Student | Click "Book a Lesson" | CONFIRMED booking, payment captured |
| Payment | System/Stripe | Booking creation | Funds held, 85/15 split on completion |
| Review | Student | After COMPLETED booking | Rating and comment stored |
| Progress Tracking | Instructor | After lesson completion | Skill levels updated, notes added |
| Messaging | Student/Instructor | Active booking exists | Messages exchanged |
| Cancellation | Student or Instructor | Cancel button | Refund processed, optionally continuity triggered |
| ADI Verification | Admin | Instructor submits ADI | Verified badge granted |
