# KerbSide - Process Flow Diagrams

## Overview

This document contains text-based process flow diagrams for all major system processes in the KerbSide marketplace platform.

---

## 1. Instructor Registration Flow

```
START
  |
  v
[Landing Page]
  |
  | Click "Sign Up as Instructor"
  v
[Step 1: Account Details]
  |
  | Enter: email, password, name, phone
  | Validate: email unique, password policy (8+ chars, mixed case, 1 digit)
  |
  |--- FAIL: "Email already exists" --> [Show Error] --> [Step 1]
  |
  | SUCCESS: Create User (role=INSTRUCTOR) + empty InstructorProfile
  v
[Step 2: Professional Information]
  |
  | Enter: ADI number (6 digits), teaching style, car type, hourly rate
  | Validate: ADI format, rate GBP 20-100
  |
  |--- FAIL: Validation error --> [Show Error] --> [Step 2]
  |
  | SUCCESS: Update InstructorProfile (adiVerified=false)
  v
[Step 3: Profile Setup]
  |
  | Enter: bio (max 500), gender, languages (min 1),
  |        specialisms, anxiety-friendly, coverage postcodes (min 1)
  | Validate: min 1 language, min 1 postcode
  |
  |--- FAIL: Missing required fields --> [Show Error] --> [Step 3]
  |
  | SUCCESS: Update InstructorProfile
  v
[Step 4: Availability Setup]
  |
  | View: Weekly calendar grid (Mon-Sun, 06:00-21:00)
  | Action: Click to add slots (day, start, end, recurring flag)
  | Validate: min 1 slot, start < end
  |
  |--- FAIL: No slots added --> [Show Warning] --> [Step 4]
  |
  | SUCCESS: Create Availability records
  v
[Step 5: Stripe Connect Onboarding]
  |
  | System: POST /api/payments/connect
  | Action: Create Stripe Express account + Account Link
  |
  |--- FAIL: Stripe error --> [Show Retry Option] --> [Step 5]
  |
  | SUCCESS: Redirect to Stripe hosted onboarding
  v
[Stripe KYC Flow (external)]
  |
  | Complete: Identity verification, bank details
  |
  |--- ABANDONED: Return to KerbSide (payments disabled)
  |
  | COMPLETED: Redirect back to KerbSide
  v
[Store stripeAccountId on profile]
  |
  v
[Dashboard - Profile Live]
  |
  | Profile visible in search
  | Can receive bookings
  | Admin will verify ADI (async)
  v
END
```

### States After Registration

| State | Condition | Capabilities |
|-------|-----------|-------------|
| Profile Incomplete | Steps 1-4 done, Step 5 skipped | Visible but cannot accept payments |
| Profile Active | All steps complete | Full functionality |
| ADI Verified | Admin approves ADI number | "Verified" badge on profile |

---

## 2. Student Registration Flow

```
START
  |
  v
[Landing Page]
  |
  | Click "Find My Instructor"
  v
[Account Creation]
  |
  | Enter: email, password, name, phone (optional)
  | Validate: email unique, password policy
  |
  |--- FAIL: "Email already exists" --> [Show Error] --> [Account Creation]
  |
  | SUCCESS: Create User (role=STUDENT) + StudentProfile
  v
[Preference Setup]
  |
  +-- Location: Enter postcode
  |
  +-- Gender Preference: Male / Female / No Preference
  |
  +-- Language: Preferred instruction language
  |
  +-- Teaching Style: Patient / Intensive / Structured / Relaxed / No Preference
  |
  +-- Car Type: Manual / Automatic / No Preference
  |
  +-- Anxiety-Friendly: Toggle on/off
  |
  +-- Lesson Format: Hourly / Block 5 / Block 10
  |
  +-- Pickup Flexibility: 1-30 km (default 5)
  |
  +-- Goal Timeline: Free text (e.g., "Pass in 3 months")
  |
  +-- Availability Pattern: Free text (e.g., "Weekday evenings")
  |
  | All preferences optional (neutral scores if blank)
  v
[Save StudentProfile]
  |
  v
[Trigger Matching Engine (automatic)]
  |
  | System: POST /api/matching with student ID
  |
  |--- NO RESULTS: Show "No instructors in your area yet"
  |
  | RESULTS FOUND: Top 10 ranked instructors
  v
[Redirect to Dashboard - Show Matches]
  |
  | Display: Instructor cards with match % and breakdown
  | Actions: View Profile, Book Now, Filter Results
  v
END
```

---

## 3. Smart Matching Flow

```
START (Trigger: registration complete OR manual refresh OR preference update)
  |
  v
[Load Student Preferences]
  |
  | Query: StudentProfile by student ID
  | Extract: postcode, preferredGender, preferredLanguage,
  |          preferredTeachingStyle, preferredCarType,
  |          anxietyFriendly, availabilityPattern
  v
[Load All Instructor Profiles]
  |
  | Query: All InstructorProfiles with Availability slots
  | Filter: Only profiles with at least 1 availability slot
  v
[For Each Instructor: Calculate 8 Factor Scores]
  |
  +--[1. Location Score (weight: 0.25)]
  |    | Exact postcode in coverage = 100
  |    | Postcode prefix match (3 chars) = 50
  |    | No match = 0
  |
  +--[2. Gender Score (weight: 0.15)]
  |    | No preference = 100
  |    | Preference matches instructor = 100
  |    | Instructor gender unknown = 50
  |    | Mismatch = 0
  |
  +--[3. Language Score (weight: 0.15)]
  |    | Language in instructor list = 100
  |    | No preference or no languages = 50
  |    | Language not found = 0
  |
  +--[4. Teaching Style Score (weight: 0.15)]
  |    | Exact match = 100
  |    | Instructor is ADAPTIVE = 75
  |    | No preference = 100
  |    | Mismatch = 0
  |
  +--[5. Car Type Score (weight: 0.10)]
  |    | Match or instructor offers BOTH = 100
  |    | No preference = 100
  |    | No car type set = 50
  |    | Mismatch = 0
  |
  +--[6. Availability Score (weight: 0.10)]
  |    | Parse student pattern for day/time keywords
  |    | Count matching instructor slots
  |    | 5+ matches = 100, 3-4 = 80, 2 = 60, 1 = 40, 0 = 10
  |
  +--[7. Anxiety Score (weight: 0.05)]
  |    | Not needed = 100
  |    | Needed and offered = 100
  |    | Needed but not offered = 0
  |
  +--[8. Specialism Score (weight: 0.05)]
       | 3+ specialisms = 100
       | 1-2 specialisms = 75
       | 0 specialisms = 50
  |
  v
[Calculate Overall Score]
  |
  | Formula: SUM(factor_score * weight) for all 8 factors
  | Result: 0.00 - 100.00 (rounded to 2 decimal places)
  v
[Sort by Overall Score DESC]
  |
  v
[Take Top N Results (default: 10)]
  |
  v
[Upsert MatchScore Records]
  |
  | For each result: INSERT or UPDATE in match_scores table
  | Unique constraint: [studentId, instructorId]
  v
[Return Results to Client]
  |
  | Response includes:
  |   - Instructor profile details
  |   - Overall match percentage
  |   - Per-factor score breakdown
  |   - Availability preview
  v
END
```

### Matching Edge Cases

| Scenario | Handling |
|----------|----------|
| Student has no preferences | All factors return 50-100, location is primary |
| No instructors in area | Return empty with helpful message |
| All scores very low (< 30) | Show results with "Consider expanding preferences" |
| Instructor has no availability | Excluded from results (filtered before scoring) |
| Stale cached scores | Overwritten on next match request (upsert) |

---

## 4. Booking & Payment Flow

```
START
  |
  v
[Student views Instructor Profile]
  |
  | Click "Book a Lesson"
  v
[Booking Page: /booking/[instructorId]]
  |
  | Display: Instructor's available time slots (calendar view)
  v
[Select Date & Time Slot]
  |
  |--- Slot already booked --> [Show "Unavailable"] --> [Select Another]
  |
  | SUCCESS: Slot selected
  v
[Configure Booking Details]
  |
  | Select: Duration (30/60/90/120/180 min)
  | Calculate: Price = hourlyRate * (duration / 60)
  | Calculate: Commission = price * 0.15
  | Optional: Add lesson notes
  v
[Confirm Booking]
  |
  | Review: Instructor, date, time, duration, total price
  | Click: "Confirm & Pay"
  v
[POST /api/bookings]
  |
  | Server validates:
  |   - Student authenticated
  |   - Instructor exists
  |   - Instructor has Stripe account
  |   - Time slot is available
  |
  |--- VALIDATION FAIL --> [Show Error] --> [Booking Page]
  |
  | Server creates:
  |   - Booking record (status: PENDING)
  |   - Stripe PaymentIntent with:
  |     * amount (in pence)
  |     * application_fee_amount (15%)
  |     * transfer_data.destination (instructor Stripe ID)
  v
[Return client_secret to Frontend]
  |
  v
[Stripe Elements: Enter Card Details]
  |
  | stripe.confirmPayment({ clientSecret })
  |
  |--- CARD DECLINED --> [Show "Payment failed"] --> [Retry]
  |
  | SUCCESS: Payment processed
  v
[Stripe Webhook: payment_intent.succeeded]
  |
  | POST /api/payments/webhook
  | Verify: Stripe signature
  | Find: Booking by paymentIntentId
  | Update: status PENDING --> CONFIRMED
  v
[Send Notifications]
  |
  +-- Student: "Booking confirmed for [date] with [instructor]"
  +-- Instructor: "New booking from [student] on [date]"
  v
[Booking Visible in Both Dashboards]
  |
  v
END (Booking CONFIRMED)
```

### Payment State Transitions

```
PENDING  ----[payment_intent.succeeded]----> CONFIRMED
PENDING  ----[payment_intent.failed]-------> CANCELLED (funds released)
PENDING  ----[student cancels]-------------> CANCELLED (funds released)
CONFIRMED ---[lesson occurs]---------------> COMPLETED
CONFIRMED ---[student/instructor cancels]--> CANCELLED (full refund)
COMPLETED ---(terminal)
CANCELLED ---(terminal)
```

---

## 5. Review Submission Flow

```
START
  |
  v
[Booking Status: COMPLETED]
  |
  | Student sees "Leave Review" prompt on dashboard
  | or navigates to booking details
  v
[Click "Leave Review"]
  |
  v
[Eligibility Check]
  |
  | Verify: Booking status == COMPLETED
  | Verify: Current user == booking student
  | Verify: No existing review for this booking
  |
  |--- INELIGIBLE --> [Show Error Message] --> END
  |
  | ELIGIBLE
  v
[Review Form]
  |
  | Star Rating: 1-5 (required)
  | Comment: Free text, max 1000 chars (optional)
  v
[Submit Review]
  |
  | POST /api/bookings/[id]/review
  |
  | Validate:
  |   - Rating is integer 1-5
  |   - Comment <= 1000 chars
  |   - No duplicate review (unique on bookingId)
  |
  |--- VALIDATION FAIL --> [Show Errors] --> [Review Form]
  |
  | SUCCESS: Create Review record
  |   - Linked to: booking, student, instructor
  v
[Update Instructor Profile]
  |
  | Recalculate: Average rating across all reviews
  v
[Display Review]
  |
  +-- On instructor's public profile (with "Verified" badge)
  +-- In student's booking history
  +-- In instructor's dashboard (new review notification)
  v
END
```

---

## 6. Cancellation & Continuity Flow

```
START (Cancellation Request)
  |
  v
[Identify Cancelling Party]
  |
  +-- Student cancels --> [PATH A: Simple Cancellation]
  +-- Instructor cancels --> [PATH B: Continuity Triggered]
  |
  |=============================================
  | PATH A: Student Cancellation
  |=============================================
  v
[Validate: Booking status == CONFIRMED]
  |
  |--- INVALID STATUS --> [Error: Cannot cancel] --> END
  |
  v
[Process Refund]
  |
  | stripe.refunds.create({ payment_intent: booking.paymentIntentId })
  | Full refund to student
  | Instructor transfer reversed
  | Platform fee reversed
  v
[Update Booking: status --> CANCELLED]
  |
  v
[Notify Instructor: "Student cancelled booking on [date]"]
  |
  v
END (No continuity - student chose to cancel)

  |=============================================
  | PATH B: Instructor Cancellation (with Continuity)
  |=============================================
  v
[Validate: Booking status == CONFIRMED]
  |
  v
[Process Full Refund]
  |
  | stripe.refunds.create({ payment_intent: booking.paymentIntentId })
  v
[Update Booking: status --> CANCELLED]
  |
  v
[Notify Student: "Your instructor [name] cancelled on [date]"]
  |
  v
[Trigger Continuity Engine]
  |
  | 1. Load original booking details (student, time, preferences)
  | 2. Run matching engine with student preferences
  | 3. EXCLUDE the cancelling instructor from results
  | 4. Filter: instructors with availability near original time
  v
[Find Top 5 Replacement Instructors]
  |
  |--- NO SUITABLE REPLACEMENTS FOUND
  |     |
  |     v
  |     [Notify Student: "No replacement found, try searching manually"]
  |     --> END
  |
  | REPLACEMENTS FOUND
  v
[Send Replacement Suggestions to Student]
  |
  | For each suggestion:
  |   - Instructor name and match score
  |   - Available times near original booking
  |   - "Book with [Name]" action button
  v
[Student Receives Notification]
  |
  +-- Click "Book with [Name]" --> [Booking Flow for new instructor]
  +-- Search manually --> [Match Results Page]
  +-- Ignore --> END
  v
END
```

### Cancellation Rules

| Scenario | Refund | Continuity | Notification |
|----------|--------|-----------|--------------|
| Student cancels PENDING | Release hold | No | Instructor notified |
| Student cancels CONFIRMED | Full refund | No | Instructor notified |
| Instructor cancels CONFIRMED | Full refund | Yes (5 suggestions) | Student notified |
| System cancels (payment failed) | No charge | No | Both notified |
| After COMPLETED | Not possible | N/A | N/A |

---

## 7. Admin Verification Flow

```
START
  |
  v
[Instructor submits ADI number during registration]
  |
  | Stored: adiNumber on InstructorProfile
  | Status: adiVerified = false
  v
[Admin logs in (role = ADMIN)]
  |
  v
[Navigate to Admin Dashboard > Pending Verifications]
  |
  | GET /api/admin/instructors?status=pending
  v
[View Pending List]
  |
  | Each entry shows:
  |   - Instructor name, email
  |   - ADI number submitted
  |   - Registration date
  |   - Profile completeness %
  v
[Select Instructor to Review]
  |
  v
[Admin Reviews ADI Number]
  |
  | Manual check against DVSA records (at MVP)
  | Verify: 6-digit format, valid registration
  |
  +-- Decision: APPROVE
  |     |
  |     | PUT /api/admin/instructors { instructorId, action: "approve" }
  |     | Update: adiVerified = true
  |     | Notify instructor: "Your ADI number has been verified"
  |     v
  |     [Verified badge appears on profile]
  |     [Higher ranking in search results]
  |     --> END
  |
  +-- Decision: REJECT
        |
        | PUT /api/admin/instructors { instructorId, action: "reject" }
        | Update: adiVerified remains false
        | Notify instructor: "ADI verification failed - please resubmit"
        v
        [Instructor can update and resubmit]
        --> END
```

### Verification Impact

| Feature | Unverified | Verified |
|---------|-----------|----------|
| Profile visible | Yes | Yes |
| Receives bookings | Yes | Yes |
| Search ranking | Normal | Boosted |
| Profile badge | None | "Verified" badge |
| Filter: "Verified only" | Excluded | Included |
| Student trust signal | Low | High |

---

## 8. Message Exchange Flow

```
START
  |
  v
[User opens /dashboard/messages]
  |
  v
[Load Conversations]
  |
  | GET /api/messages
  | Returns: List of conversations grouped by other party
  | Each: last message preview, unread count, timestamp
  v
[Display Conversation List (left panel)]
  |
  v
[User selects a conversation]
  |
  v
[Privacy Gate Check]
  |
  | System verifies: Active booking exists between users
  | Active = PENDING, CONFIRMED, or COMPLETED
  |
  |--- NO ACTIVE BOOKING --> [Show "Messaging unavailable"] --> END
  |
  | BOOKING EXISTS
  v
[Load Messages]
  |
  | GET /api/messages/[conversationId]
  | Returns: All messages ordered chronologically
  v
[Display Chat Window (right panel)]
  |
  | Show: Message bubbles with sender, content, timestamp
  | Mark: All unread messages as read (PUT /api/messages/[conversationId])
  v
[User types message]
  |
  | Validate: 1-2000 characters
  |
  |--- EMPTY or > 2000 chars --> [Show validation error]
  |
  | VALID
  v
[Send Message]
  |
  | POST /api/messages
  | Body: { receiverId, content, bookingId (optional) }
  |
  | Create: Message record (read: false)
  v
[Message appears in chat window]
  |
  | Recipient sees: New message on next page load/refresh
  | Sender sees: Message in conversation immediately
  v
[Recipient opens conversation later]
  |
  | Unread messages marked as read
  | Sender can see read status on refresh
  v
END
```

### Message Lifecycle

```
[Compose] --> [Validate] --> [Send (read:false)] --> [Delivered]
                                                        |
                                          Recipient opens conversation
                                                        |
                                                        v
                                                  [Read (read:true)]
```

---

## 9. Progress Tracking Flow

```
START
  |
  v
[Instructor marks booking as COMPLETED]
  |
  | PUT /api/bookings/[id] { status: "COMPLETED" }
  v
[Navigate to Student Progress Section]
  |
  | View: Existing skills and levels for this student
  v
[Click "Log Progress"]
  |
  v
[Progress Entry Form]
  |
  | Select Skill: From predefined list or custom entry
  |   - Moving Off & Stopping
  |   - Steering Control
  |   - Use of Mirrors
  |   - Signalling
  |   - Junctions
  |   - Roundabouts
  |   - Pedestrian Crossings
  |   - Dual Carriageways
  |   - Parallel Parking
  |   - Bay Parking
  |   - Emergency Stop
  |   - Independent Driving
  |   - [Custom skill name]
  |
  | Set Level: 1-5
  |   1 = Introduced (first exposure)
  |   2 = Developing (needs guidance)
  |   3 = Competent (minor prompts)
  |   4 = Proficient (consistent)
  |   5 = Mastered (test-ready)
  |
  | Add Notes: Optional free text
  v
[Submit Progress Entry]
  |
  | POST /api/progress
  | Body: { studentId, skillName, level, notes }
  |
  | Validate:
  |   - Instructor authenticated
  |   - Student exists
  |   - Skill name not empty
  |   - Level is integer 1-5
  |
  |--- VALIDATION FAIL --> [Show Errors] --> [Form]
  |
  | SUCCESS: Create Progress record
  v
[Progress Entry Saved]
  |
  +-- Linked to: student, instructor, date
  +-- Visible on: Student's progress dashboard
  v
[Student Views Progress Dashboard]
  |
  | GET /api/progress?studentId=[id]
  |
  | Display:
  |   - Skill progress bars (1-5 scale, visual)
  |   - Overall readiness % (skills at 4-5 / total skills)
  |   - Chronological lesson log
  |   - Filter by skill or date
  v
END
```

### Progress Data Flow

```
[Instructor logs] --> [Progress Entry] --> [Student Dashboard]
        |                                         |
        |                                         v
        |                              [Visual Progress Bars]
        |                              [Lesson History Log]
        |                              [Overall Readiness %]
        |
        +--- Multiple instructors contribute to same student
             (entries aggregated, most recent level shown)
```

---

## 10. Complete Booking Lifecycle

This diagram shows all possible state transitions for a booking from creation to terminal state.

```
                          +-------------------+
                          |     CREATED       |
                          | (PaymentIntent    |
                          |  created)         |
                          +-------------------+
                                   |
                    +--------------+--------------+
                    |                             |
        payment_intent.succeeded         payment_intent.failed
                    |                    OR student cancels
                    v                             |
            +-------------+                      v
            |  CONFIRMED  |              +-------------+
            |             |              |  CANCELLED  |
            +-------------+              |  (terminal) |
                    |                    +-------------+
         +----------+----------+
         |                     |
    lesson occurs      student/instructor
    instructor marks     cancels
    complete                   |
         |                     v
         v              [Process Refund]
    +-------------+            |
    |  COMPLETED  |            v
    |  (terminal) |    +-------------+
    +-------------+    |  CANCELLED  |
         |             |  (terminal) |
         v             +-------------+
    [Eligible for              |
     Review]                   |
         |          (if instructor cancelled)
         v                     v
    +----------+    [Continuity Engine]
    |  REVIEW  |         |
    | SUBMITTED|         v
    +----------+    [5 Replacement
                     Suggestions]
```

