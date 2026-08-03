# KerbSide - User Stories & Acceptance Criteria

## Overview

This document contains comprehensive user stories with acceptance criteria for all 23 features of the KerbSide marketplace platform. Stories are organized by feature and prioritized using P0 (critical MVP), P1 (important MVP), P2 (post-MVP enhancement), and P3 (future consideration).

### Personas Referenced

- **Sarah** - Anxious learner (25), wants female instructor, patient style
- **Amir** - International student (21), Urdu speaker, automatic car, budget-conscious
- **Dave** - Experienced ADI (48), wants more students, simple tools
- **Priya** - New PDI (29), nervous driver specialist, Hindi/English

---

## Feature 1: Instructor Onboarding & Profiles

**Priority:** P0 (Critical MVP)

**Epic:** As a driving instructor, I want to create a comprehensive professional profile on KerbSide so that learner drivers can find and book lessons with me.

### User Stories

#### US-1.1: Account Registration
**As a** driving instructor,
**I want to** create an account with my email and password,
**So that** I can access the platform and manage my professional presence.

**Acceptance Criteria:**
- Given I am on the landing page, When I click "Sign Up as Instructor", Then I am taken to the instructor registration form
- Given I am on the registration form, When I enter a valid email, password (8+ chars, mixed case, 1 digit), and name, Then my account is created with role INSTRUCTOR
- Given I enter an email that already exists, When I submit the form, Then I see "An account with this email already exists"
- Given my account is created, When registration completes, Then an empty InstructorProfile is linked to my User record

#### US-1.2: Professional Information Entry
**As a** driving instructor,
**I want to** enter my ADI number and teaching details,
**So that** students can verify my credentials and understand my offering.

**Acceptance Criteria:**
- Given I am in step 2 of registration, When I enter my 6-digit ADI number, Then it is stored with adiVerified = false
- Given I enter a non-6-digit ADI number, When I try to proceed, Then I see "ADI number must be exactly 6 digits"
- Given I am in step 2, When I select my teaching style, car type, and hourly rate (GBP 20-100), Then these are saved to my profile
- Given I enter an hourly rate outside 20-100, When I try to proceed, Then I see a validation error

#### US-1.3: Profile Setup
**As a** driving instructor,
**I want to** add my bio, languages, specialisms, and coverage areas,
**So that** the matching engine can pair me with suitable students.

**Acceptance Criteria:**
- Given I am in step 3 of registration, When I write a bio (max 500 chars), select gender, add languages (min 1), and add coverage postcodes (min 1), Then my profile is updated
- Given I try to proceed without any languages, When I submit, Then I see a validation error requiring at least one language
- Given I try to proceed without any coverage postcodes, When I submit, Then I see a validation error requiring at least one postcode
- Given I check "anxiety-friendly", When my profile is saved, Then the anxietyFriendly flag is set to true

#### US-1.4: Availability Setup
**As a** driving instructor,
**I want to** set my weekly availability with recurring and one-off slots,
**So that** students can see when I am free and book accordingly.

**Acceptance Criteria:**
- Given I am in step 4, When I see the weekly calendar grid (Mon-Sun, 06:00-21:00), Then I can click to add time slots
- Given I add a slot, When I specify day, start time, and end time, Then the slot is saved as recurring by default
- Given I want a one-off slot, When I toggle recurring off and select a specific date, Then a non-recurring slot is created
- Given I have no slots added, When I try to proceed, Then I see a message requiring at least one slot

#### US-1.5: Stripe Connect Onboarding
**As a** driving instructor,
**I want to** connect my bank account via Stripe,
**So that** I can receive payments from students automatically.

**Acceptance Criteria:**
- Given I am in step 5, When the system creates a Stripe Express account, Then I am redirected to Stripe's hosted onboarding
- Given I complete Stripe KYC, When I am redirected back to KerbSide, Then my stripeAccountId is stored on my profile
- Given I abandon Stripe onboarding, When I return to KerbSide, Then my profile is created but payments are disabled until Stripe setup is completed
- Given Stripe account creation fails, When an error occurs, Then I see a retry option


---

## Feature 2: Student Sign-up & Match Profile

**Priority:** P0 (Critical MVP)

**Epic:** As a learner driver, I want to create an account and specify my preferences so that the platform can match me with the best instructor for my needs.

### User Stories

#### US-2.1: Student Account Creation
**As a** learner driver,
**I want to** sign up quickly with my basic details,
**So that** I can start finding an instructor.

**Acceptance Criteria:**
- Given I am on the landing page, When I click "Find My Instructor", Then I am taken to the student registration form
- Given I am on the registration form, When I enter valid email, password, and name, Then my account is created with role STUDENT
- Given my account is created, When registration completes, Then a StudentProfile is linked to my User record
- Given I enter a duplicate email, When I submit, Then I see "An account with this email already exists"

#### US-2.2: Location Preference
**As a** learner driver,
**I want to** enter my pickup postcode,
**So that** I am matched with instructors who operate in my area.

**Acceptance Criteria:**
- Given I am in the preference setup, When I enter my postcode, Then it is stored on my StudentProfile
- Given I enter an invalid postcode format, When I submit, Then I see "Please enter a valid UK postcode"
- Given I leave the postcode blank, When matching runs, Then location scores default to 0 (broader results shown)

#### US-2.3: Instructor Preferences
**As a** learner driver (like Sarah who needs a female, patient instructor),
**I want to** specify my instructor gender, language, and teaching style preferences,
**So that** the matching engine finds instructors who fit my personal needs.

**Acceptance Criteria:**
- Given I am in preference setup, When I select a gender preference (Male/Female/No Preference), Then it is saved to preferredGender
- Given I am in preference setup, When I enter a preferred language, Then it is saved to preferredLanguage
- Given I am in preference setup, When I select a teaching style, Then it is saved to preferredTeachingStyle
- Given I select no preferences, When matching runs, Then neutral scores are assigned (wider results)

#### US-2.4: Lesson Preferences
**As a** learner driver (like Amir who needs automatic, flexible scheduling),
**I want to** specify car type, anxiety needs, lesson format, and availability,
**So that** practical constraints are factored into my match results.

**Acceptance Criteria:**
- Given I am in preference setup, When I select car type (Manual/Automatic/No Preference), Then it is saved
- Given I toggle anxiety-friendly on, When saved, Then anxietyFriendly is set to true on my profile
- Given I select a lesson format (Hourly/Block 5/Block 10), Then it is saved to preferredLessonFormat
- Given I enter pickup flexibility (1-30 km), Then it is stored as pickupFlexibilityKm
- Given I enter a goal timeline and availability pattern, Then these free-text fields are saved

#### US-2.5: Immediate Match Results
**As a** learner driver,
**I want to** see my top matched instructors immediately after registration,
**So that** I can book a lesson without delay.

**Acceptance Criteria:**
- Given I complete registration, When my profile is saved, Then the matching engine runs automatically
- Given matching completes, When results are ready, Then I am redirected to my dashboard showing top matched instructors
- Given no instructors are found in my area, When results display, Then I see "No instructors found in your area yet"


---

## Feature 3: Smart Matching Engine

**Priority:** P0 (Critical MVP)

**Epic:** As a learner driver, I want to be matched with instructors based on 8 weighted factors so that I find the most compatible instructor for my specific needs.

### User Stories

#### US-3.1: Automatic Match Calculation
**As a** learner driver,
**I want** the system to automatically score all available instructors against my preferences,
**So that** I receive a ranked list of the best-fit instructors.

**Acceptance Criteria:**
- Given I have a complete profile, When I request matches (POST /api/matching), Then each instructor receives a score from 0-100
- Given scoring runs, When results return, Then they are sorted by overall score descending
- Given scoring runs, When results return, Then the top 10 instructors are included by default
- Given scores are calculated, When results are stored, Then they are cached in the MatchScore table via upsert

#### US-3.2: 8-Factor Scoring Breakdown
**As a** learner driver,
**I want** to see how each factor contributes to my match score,
**So that** I understand why a particular instructor is recommended.

**Acceptance Criteria:**
- Given match results display, When I view an instructor card, Then I see the overall percentage and per-factor scores
- Given scoring runs, When location is evaluated, Then exact postcode match = 100, prefix match = 50, no match = 0 (weight 25%)
- Given scoring runs, When gender is evaluated, Then preference match = 100, no preference = 100, mismatch = 0 (weight 15%)
- Given scoring runs, When language is evaluated, Then language found in list = 100, not found = 0, no preference = 50 (weight 15%)
- Given scoring runs, When style is evaluated, Then exact match = 100, ADAPTIVE = 75, mismatch = 0 (weight 15%)
- Given scoring runs, When car type is evaluated, Then match or BOTH = 100, mismatch = 0 (weight 10%)
- Given scoring runs, When availability is evaluated, Then 5+ matching slots = 100, 0 matching = 10 (weight 10%)
- Given scoring runs, When anxiety is evaluated, Then not needed = 100, needed and offered = 100, needed not offered = 0 (weight 5%)
- Given scoring runs, When specialisms are evaluated, Then 3+ = 100, 1-2 = 75, 0 = 50 (weight 5%)

#### US-3.3: Match Refresh
**As a** learner driver,
**I want to** refresh my matches after updating preferences,
**So that** my results reflect my current needs.

**Acceptance Criteria:**
- Given I am on my dashboard, When I click "Refresh Matches", Then the matching engine re-runs with my current preferences
- Given I update a preference field, When I save my profile, Then cached match scores are invalidated
- Given matching re-runs, When new scores are computed, Then the MatchScore table is updated via upsert

#### US-3.4: Match Filtering
**As a** learner driver,
**I want to** filter my match results by price, rating, and availability,
**So that** I can narrow down results to practical constraints.

**Acceptance Criteria:**
- Given I am on the matches page, When I set a maximum price filter, Then only instructors at or below that rate are shown
- Given I am on the matches page, When I filter by minimum rating, Then only instructors with that average rating or higher are shown
- Given I am on the matches page, When I filter by specific days, Then only instructors with availability on those days are shown
- Given I check "Verified only", When filter applies, Then only instructors with adiVerified = true are shown


---

## Feature 4: Live Availability Calendar

**Priority:** P0 (Critical MVP)

**Epic:** As a driving instructor, I want to manage my weekly availability through a visual calendar so that students can see when I am free and book lessons.

### User Stories

#### US-4.1: View Weekly Calendar
**As a** driving instructor (like Dave who wants to fill schedule gaps),
**I want to** see my availability displayed on a weekly calendar grid,
**So that** I can visualize my schedule at a glance.

**Acceptance Criteria:**
- Given I am on my availability page, When the page loads, Then I see a calendar grid showing Mon-Sun, 06:00-21:00
- Given I have existing slots, When the calendar renders, Then my available slots are highlighted on the grid
- Given I have bookings against slots, When viewing the calendar, Then booked slots are visually distinguished from open slots

#### US-4.2: Add Recurring Slots
**As a** driving instructor,
**I want to** add recurring weekly time slots,
**So that** my regular availability is automatically shown each week.

**Acceptance Criteria:**
- Given I am on the availability page, When I click a time slot on the grid, Then a form appears to add a new slot
- Given I set day, start time, and end time with recurring = true, When I save, Then the slot appears on the same day each week
- Given I add a slot, When I set start time >= end time, Then I see a validation error
- Given I save a recurring slot, When the next week rolls over, Then the slot is still visible

#### US-4.3: Add One-Off Slots
**As a** driving instructor,
**I want to** add availability for a specific date,
**So that** I can accommodate occasional schedule changes.

**Acceptance Criteria:**
- Given I toggle "One-off" when adding a slot, When I select a specific date, Then the slot is created with isRecurring = false and specificDate set
- Given I create a one-off slot, When that date has passed, Then the slot is no longer shown as available
- Given I create a one-off slot on a date that conflicts with a recurring slot, When saved, Then both slots are valid (overlap allowed)

#### US-4.4: Edit and Delete Slots
**As a** driving instructor,
**I want to** modify or remove existing time slots,
**So that** I can keep my availability current.

**Acceptance Criteria:**
- Given I have an existing slot, When I click on it, Then I can edit the start time, end time, or recurring status
- Given I click delete on a slot, When I confirm deletion, Then the slot is removed from my calendar
- Given a slot has a confirmed booking against it, When I try to delete the slot, Then I am warned that existing bookings will not be affected


---

## Feature 5: Booking & Payments

**Priority:** P0 (Critical MVP)

**Epic:** As a learner driver, I want to book and pay for driving lessons online with transparent pricing so that I can secure my lesson slot with confidence.

### User Stories

#### US-5.1: Select Time Slot
**As a** learner driver,
**I want to** view an instructor's available slots and select one for my lesson,
**So that** I can choose a time that works for my schedule.

**Acceptance Criteria:**
- Given I am on an instructor's profile, When I click "Book a Lesson", Then I am taken to the booking page showing available slots
- Given I see the slot calendar, When I select a date and time slot, Then that slot is highlighted as selected
- Given a slot has already been booked, When viewing the calendar, Then that slot is shown as unavailable
- Given I select a slot, When I proceed, Then I see the booking confirmation details

#### US-5.2: Confirm Booking Details
**As a** learner driver,
**I want to** confirm the lesson duration and see the price before paying,
**So that** I know exactly what I am committing to.

**Acceptance Criteria:**
- Given I selected a slot, When I see the confirmation screen, Then it shows instructor name, date, time, and price
- Given I can choose duration (30, 60, 90, 120, 180 min), When I select a duration, Then the price updates (hourlyRate * duration/60)
- Given I see the total price, When the breakdown is shown, Then it reflects the instructor's hourly rate
- Given I want to add lesson notes, When I enter text in the notes field, Then it is included in the booking

#### US-5.3: Process Payment
**As a** learner driver,
**I want to** pay securely via card using Stripe,
**So that** my lesson is confirmed and the instructor is guaranteed payment.

**Acceptance Criteria:**
- Given I confirm booking details, When the system creates a PaymentIntent, Then it includes 15% application_fee_amount and transfer_data.destination
- Given the PaymentIntent is created, When I enter my card details in Stripe Elements, Then I can confirm payment
- Given payment succeeds, When Stripe fires payment_intent.succeeded webhook, Then my booking status changes to CONFIRMED
- Given payment fails, When the card is declined, Then I see "Payment failed. Please try another card."

#### US-5.4: Commission Split
**As a** platform operator,
**I want** 15% commission automatically deducted from each booking,
**So that** the platform generates revenue while instructors receive 85%.

**Acceptance Criteria:**
- Given a lesson costs GBP 35, When payment is processed, Then the platform receives GBP 5.25 and the instructor receives GBP 29.75
- Given payment succeeds, When the Stripe destination charge completes, Then the split is handled automatically by Stripe
- Given a booking is cancelled, When a refund is processed, Then both the instructor transfer and platform fee are reversed

#### US-5.5: Booking Notifications
**As a** learner driver or instructor,
**I want to** receive confirmation when a booking is made,
**So that** both parties know the lesson is scheduled.

**Acceptance Criteria:**
- Given a booking is confirmed, When the webhook fires, Then the student receives a confirmation notification
- Given a booking is confirmed, When the webhook fires, Then the instructor receives a new booking notification
- Given a booking appears, When I view my dashboard, Then the booking shows in my upcoming bookings list


---

## Feature 6: Verified Reviews

**Priority:** P1 (Important MVP)

**Epic:** As a learner driver, I want to leave verified reviews only after completing a lesson so that instructor ratings are trustworthy and authentic.

### User Stories

#### US-6.1: Review Eligibility
**As a** learner driver,
**I want** the system to only allow reviews for completed lessons,
**So that** fake or premature reviews are impossible.

**Acceptance Criteria:**
- Given my booking status is COMPLETED, When I view the booking, Then I see a "Leave Review" option
- Given my booking status is PENDING or CONFIRMED, When I view the booking, Then no review option is shown
- Given a review already exists for a booking, When I try to submit another, Then I see "You have already reviewed this lesson"
- Given I am not the student on the booking, When I try to submit a review, Then I receive a 403 Forbidden error

#### US-6.2: Submit Review
**As a** learner driver (like Sarah who wants to praise a patient instructor),
**I want to** rate my instructor from 1-5 stars and optionally write a comment,
**So that** future students benefit from my experience.

**Acceptance Criteria:**
- Given I click "Leave Review", When the review form appears, Then I can select 1-5 stars (required)
- Given I am writing a comment, When I exceed 1000 characters, Then I see a character limit warning
- Given I submit with a valid rating, When the review is saved, Then it is linked to the booking, student, and instructor
- Given I submit without selecting stars, When I click submit, Then I see a validation error requiring a rating

#### US-6.3: Display Reviews on Profile
**As a** learner driver browsing instructors,
**I want to** see verified reviews on instructor profiles,
**So that** I can make an informed decision about who to book.

**Acceptance Criteria:**
- Given an instructor has reviews, When I view their public profile, Then reviews are displayed with star rating, comment, and date
- Given reviews are shown, When I see the "Verified" badge on each, Then I know the review is tied to a real completed lesson
- Given an instructor has multiple reviews, When displayed, Then they are ordered newest first
- Given an instructor has reviews, When their profile loads, Then their average rating is calculated and displayed


---

## Feature 7: Student Progress Dashboard

**Priority:** P1 (Important MVP)

**Epic:** As a learner driver, I want to track my skill development visually over time so that I can see how close I am to being test-ready.

### User Stories

#### US-7.1: Instructor Logs Progress
**As a** driving instructor (like Priya who differentiates with progress tracking),
**I want to** log skill levels and notes after each lesson,
**So that** students can see their development and I maintain lesson records.

**Acceptance Criteria:**
- Given a booking is marked COMPLETED, When I navigate to the student's progress section, Then I can click "Log Progress"
- Given I am logging progress, When I select a skill name (from predefined list or custom), Then I can set a level 1-5
- Given I set a level, When I also add notes (optional), Then the progress entry is saved with date, skill, level, and notes
- Given I submit, When the entry is created, Then it is linked to both the student and me as the instructor

#### US-7.2: Visual Progress Display
**As a** learner driver,
**I want to** see my skills displayed as visual progress bars,
**So that** I can quickly understand my current level in each area.

**Acceptance Criteria:**
- Given I am on my progress dashboard, When the page loads, Then I see all tracked skills with progress bars (1-5 scale)
- Given a skill is at level 3, When displayed, Then the progress bar shows 60% filled with label "Competent"
- Given I have skills at levels 4-5, When overall progress is calculated, Then I see a percentage of "test-ready" skills
- Given progress bars are shown, When I hover or tap a skill, Then I see the skill level description (Introduced/Developing/Competent/Proficient/Mastered)

#### US-7.3: Lesson History Log
**As a** learner driver,
**I want to** see a chronological log of lessons and skill updates,
**So that** I can review what was covered and instructor feedback.

**Acceptance Criteria:**
- Given I am on the progress page, When I view the lesson log, Then I see entries in reverse chronological order
- Given a log entry exists, When displayed, Then it shows date, skill name, level change, and instructor notes
- Given I have entries from multiple instructors, When viewing the log, Then each entry shows which instructor logged it
- Given I want to filter, When I select a specific skill or date range, Then only matching entries are shown

#### US-7.4: Progress Across Instructors
**As a** learner driver who may change instructors,
**I want** my progress to persist regardless of which instructor I book with,
**So that** a new instructor can see my current skill levels.

**Acceptance Criteria:**
- Given I switch to a new instructor, When they view my progress, Then they see all previously logged skills and levels
- Given multiple instructors logged the same skill, When displayed, Then the most recent entry shows the current level
- Given I view my dashboard, When progress is aggregated, Then all entries from all instructors are combined


---

## Feature 8: In-App Messaging

**Priority:** P1 (Important MVP)

**Epic:** As a user with an active booking, I want to message the other party directly within the platform so that I can coordinate lesson details without sharing personal contact information.

### User Stories

#### US-8.1: Privacy-Gated Access
**As a** platform user,
**I want** messaging to only be available between users who share an active booking,
**So that** my privacy is protected from unsolicited messages.

**Acceptance Criteria:**
- Given I have a booking (PENDING, CONFIRMED, or COMPLETED) with another user, When I open messages, Then I can message that user
- Given I have no booking with a user, When I try to message them, Then the system blocks the message with an error
- Given my only booking with a user is CANCELLED, When I try to message them, Then messaging is not available

#### US-8.2: Send Messages
**As a** learner driver,
**I want to** send a message to my instructor about upcoming lessons,
**So that** I can communicate pickup location or lesson focus requests.

**Acceptance Criteria:**
- Given I am in a conversation, When I type a message (1-2000 chars) and click send, Then the message is delivered to the recipient
- Given I send a message, When it is stored, Then it is linked to my user, the recipient, and optionally the booking
- Given I try to send an empty message, When I click send, Then I see a validation error
- Given I try to send a message exceeding 2000 characters, When I submit, Then I see a character limit error

#### US-8.3: View Conversations
**As a** platform user,
**I want to** see a list of my message conversations,
**So that** I can quickly navigate to active discussions.

**Acceptance Criteria:**
- Given I have messages, When I open the messages page, Then I see a list of conversations in the left panel
- Given a conversation exists, When displayed in the list, Then it shows the other person's name, last message preview, and timestamp
- Given I have unread messages, When viewing the conversation list, Then unread conversations show a badge count

#### US-8.4: Read Receipts
**As a** message sender,
**I want to** know when my message has been read,
**So that** I know the other party has seen my communication.

**Acceptance Criteria:**
- Given I send a message, When it is delivered, Then it is marked with read = false
- Given the recipient opens the conversation, When messages are loaded, Then unread messages are marked as read via PUT request
- Given my message has been read, When I view the conversation, Then I can see the read status indicator


---

## Feature 9: Instructor Continuity

**Priority:** P1 (Important MVP)

**Epic:** As a learner driver, I want to receive automatic replacement suggestions when my instructor cancels so that my learning journey is not disrupted.

### User Stories

#### US-9.1: Instructor Cancellation Handling
**As a** learner driver,
**I want** the system to handle instructor cancellations gracefully,
**So that** I am refunded and can quickly find a replacement.

**Acceptance Criteria:**
- Given my instructor cancels a CONFIRMED booking, When cancellation is processed, Then my booking status changes to CANCELLED
- Given cancellation is processed, When a PaymentIntent exists, Then a full refund is issued via Stripe
- Given cancellation is processed, When my booking is cancelled, Then I receive a notification about the cancellation
- Given the cancellation is by the instructor (not me), When processed, Then the continuity engine is triggered

#### US-9.2: Replacement Suggestions
**As a** learner driver whose instructor cancelled,
**I want to** receive suggested replacement instructors based on my preferences,
**So that** I can quickly rebook without starting the search from scratch.

**Acceptance Criteria:**
- Given continuity is triggered, When the matching engine runs, Then it excludes the instructor who cancelled
- Given matching completes, When top results are found, Then the top 5 replacement instructors are suggested to me
- Given I receive suggestions, When displayed, Then each shows match score and available times near my original booking time
- Given I see suggestions, When I click "Book with [Name]", Then I am taken to the booking flow with that instructor

#### US-9.3: Student Cancellation (No Continuity)
**As a** learner driver who cancels my own booking,
**I want to** receive a full refund without replacement suggestions,
**So that** my cancellation is clean and simple.

**Acceptance Criteria:**
- Given I cancel my own CONFIRMED booking, When processed, Then I receive a full refund
- Given I cancel, When processing completes, Then the instructor is notified
- Given I cancel, When processing completes, Then NO replacement search is triggered
- Given I cancel a PENDING booking, When processed, Then any held funds are released


---

## Feature 10: Theory + Practical Integration

**Priority:** P2 (Post-MVP)

**Epic:** As a learner driver, I want integrated theory test preparation alongside my practical lessons so that I can manage both aspects of learning to drive in one place.

### User Stories

#### US-10.1: Theory Quiz Bank
**As a** learner driver,
**I want to** access a quiz bank of theory test questions,
**So that** I can prepare for my theory test alongside practical lessons.

**Acceptance Criteria:**
- Given I am on my student dashboard, When I navigate to "Theory Prep", Then I see categories of theory questions (road signs, hazard perception, rules of the road)
- Given I start a quiz, When I answer questions, Then I receive immediate feedback on correct/incorrect answers
- Given I complete a quiz session, When I see results, Then my score and progress are tracked over time

#### US-10.2: Theory Progress Tracking
**As a** learner driver,
**I want to** see my theory test readiness as a percentage,
**So that** I know when I am prepared to take the test.

**Acceptance Criteria:**
- Given I have completed quizzes, When I view theory progress, Then I see a percentage of categories where I score 80%+
- Given I reach 80% across all categories, When the threshold is met, Then I see a "Theory Ready" indicator
- Given my instructor views my profile, When they check theory progress, Then they can see my readiness level


---

## Feature 11: Buddy System

**Priority:** P2 (Post-MVP)

**Epic:** As a learner driver, I want to connect with other learners at a similar stage for peer support and motivation so that learning to drive feels less isolating.

### User Stories

#### US-11.1: Buddy Matching
**As a** learner driver,
**I want to** be matched with other learners at a similar stage,
**So that** I can share experiences and motivate each other.

**Acceptance Criteria:**
- Given I opt into the buddy system, When matching runs, Then I am paired with learners who have similar progress levels and are in the same area
- Given I am matched with a buddy, When I view my dashboard, Then I see my buddy's name and current progress stage
- Given I want to message my buddy, When I click their profile, Then I can send messages within the platform

#### US-11.2: Study Groups
**As a** learner driver,
**I want to** join small study groups of 3-5 learners,
**So that** we can prepare for theory together and share tips.

**Acceptance Criteria:**
- Given study groups are available, When I browse groups, Then I see groups matched by location and learning stage
- Given I join a group, When I access the group chat, Then I can message all group members
- Given I am in a group, When a member passes their test, Then the group is notified with a celebration message


---

## Feature 12: DVSA Test Slot Alerts

**Priority:** P2 (Post-MVP)

**Epic:** As a learner driver, I want to receive alerts when driving test slots become available in my area so that I can book a test as soon as possible.

### User Stories

#### US-12.1: Set Test Alert Preferences
**As a** learner driver,
**I want to** specify my preferred test centres and date ranges,
**So that** the system monitors for available slots matching my criteria.

**Acceptance Criteria:**
- Given I am on my dashboard, When I navigate to "Test Alerts", Then I can add preferred test centres by location
- Given I set preferences, When I specify a date range, Then the system monitors for slots within that range
- Given I set preferences, When I save, Then my alert preferences are stored and active

#### US-12.2: Receive Slot Notifications
**As a** learner driver,
**I want to** be notified immediately when a matching test slot appears,
**So that** I can book it before it is taken.

**Acceptance Criteria:**
- Given a test slot becomes available matching my criteria, When detected by the system, Then I receive an instant notification
- Given I receive a notification, When I view it, Then it shows test centre, date, time, and a link to book
- Given multiple slots become available, When notifications fire, Then I receive one notification per slot


---

## Feature 13: Lesson Recap Videos

**Priority:** P2 (Post-MVP)

**Epic:** As a driving instructor, I want to upload short video recaps after each lesson so that students can review key moments and reinforce their learning.

### User Stories

#### US-13.1: Upload Lesson Recap
**As a** driving instructor,
**I want to** upload a short video (1-5 min) summarising a lesson,
**So that** my student can revisit key teaching points.

**Acceptance Criteria:**
- Given a lesson is marked COMPLETED, When I navigate to the progress entry, Then I see an "Upload Recap Video" option
- Given I upload a video, When it is under 5 minutes and accepted formats (mp4, webm), Then it is stored and linked to the progress entry
- Given the upload completes, When the student views their lesson log, Then they see a "Watch Recap" button next to the entry

#### US-13.2: View Lesson Recaps
**As a** learner driver,
**I want to** watch video recaps from my lessons,
**So that** I can reinforce what I learned between sessions.

**Acceptance Criteria:**
- Given a recap video exists for my lesson, When I click "Watch Recap", Then the video plays in an embedded player
- Given I have multiple recaps, When I view my lesson log, Then videos are listed alongside their respective lesson entries
- Given I want to review before a test, When I filter by skill, Then I see all recaps related to that skill


---

## Feature 14: "Test Ready" Certification

**Priority:** P2 (Post-MVP)

**Epic:** As a driving instructor, I want to officially mark a student as test-ready so that they have confidence to book their practical exam.

### User Stories

#### US-14.1: Mark Student Test Ready
**As a** driving instructor,
**I want to** certify a student as test-ready when their skills are at the required level,
**So that** they receive official recognition of their preparedness.

**Acceptance Criteria:**
- Given a student has multiple skills at level 4-5, When I view their progress, Then I see a "Mark Test Ready" button
- Given I click "Mark Test Ready", When I confirm, Then a "Test Ready" certification is added to the student's profile with the date and my name
- Given I certify a student, When the student views their dashboard, Then they see a prominent "Test Ready" badge

#### US-14.2: Test Ready Badge Display
**As a** learner driver,
**I want** my "Test Ready" certification to be visible on my progress dashboard,
**So that** I feel confident about booking my practical test.

**Acceptance Criteria:**
- Given I have been certified test-ready, When I view my progress dashboard, Then I see a "Test Ready" badge with the certifying instructor's name and date
- Given I have the badge, When I share my profile, Then the badge is visible as a trust signal
- Given I have not been certified, When I view progress, Then I see my overall readiness percentage instead

---

## Feature 15: Block Booking Discounts

**Priority:** P2 (Post-MVP)

**Epic:** As a driving instructor, I want to offer discounted block bookings so that students commit to multiple lessons and I secure repeat bookings.

### User Stories

#### US-15.1: Configure Block Discounts
**As a** driving instructor (like Dave who wants to fill his schedule),
**I want to** set discount percentages for 5-lesson and 10-lesson blocks,
**So that** students are incentivised to commit to multiple lessons.

**Acceptance Criteria:**
- Given I am on my profile settings, When I navigate to "Block Discounts", Then I can set a percentage discount for 5-pack and 10-pack bookings
- Given I set a 10% discount on 5-packs, When a student views my profile, Then they see "5 lessons: 10% off (GBP X per lesson)" pricing
- Given I set no discount, When students view my profile, Then block pricing is shown at full hourly rate

#### US-15.2: Book a Block of Lessons
**As a** learner driver (like Amir who is budget-conscious),
**I want to** book 5 or 10 lessons at a discounted rate,
**So that** I save money while committing to regular practice.

**Acceptance Criteria:**
- Given an instructor offers block discounts, When I choose "Book 5 Lessons" or "Book 10 Lessons", Then the total price reflects the discount
- Given I pay for a block, When payment succeeds, Then 5 or 10 individual bookings are created in CONFIRMED status
- Given I have block bookings, When I view my dashboard, Then all lessons in the block are shown with a "Block Booking" label
- Given I need to cancel one lesson from a block, When I cancel, Then only that lesson is refunded (pro-rated)


---

## Feature 16: Intensive Course Packages

**Priority:** P2 (Post-MVP)

**Epic:** As a driving instructor, I want to create and sell intensive course packages so that students who want to pass quickly can book multi-day courses.

### User Stories

#### US-16.1: Create Intensive Course
**As a** driving instructor,
**I want to** define intensive course packages (e.g., 5 days, 6 hours/day),
**So that** students can book a fast-track learning experience.

**Acceptance Criteria:**
- Given I am on my profile settings, When I navigate to "Intensive Courses", Then I can create a new course package
- Given I create a course, When I specify duration (days), hours per day, and total price, Then the course is published on my profile
- Given I have availability set, When I create a course, Then I can link it to specific available date ranges

#### US-16.2: Book Intensive Course
**As a** learner driver who wants to pass quickly,
**I want to** book an intensive course with a set schedule,
**So that** I can go from beginner to test-ready in a concentrated period.

**Acceptance Criteria:**
- Given an instructor offers intensive courses, When I view their profile, Then I see the course with details (days, hours, price)
- Given I click "Book Intensive", When I select a start date, Then the full schedule is shown (all days and times)
- Given I confirm the booking, When payment processes, Then multiple daily bookings are created for the course duration
- Given I am enrolled, When I view my dashboard, Then the course appears as a cohesive unit with all sessions listed

---

## Feature 17: Referral Programme

**Priority:** P3 (Future)

**Epic:** As an existing user, I want to refer friends to KerbSide and earn rewards so that both parties benefit from the recommendation.

### User Stories

#### US-17.1: Generate Referral Link
**As an** existing student or instructor,
**I want to** generate a unique referral link,
**So that** I can share it with people I know who might benefit from the platform.

**Acceptance Criteria:**
- Given I am logged in, When I navigate to "Refer a Friend", Then I see my unique referral link and code
- Given I share my link, When a new user signs up using it, Then the referral is tracked to my account
- Given I share my link, When it is clicked, Then the sign-up form pre-fills the referral code

#### US-17.2: Earn Referral Rewards
**As a** referring user,
**I want to** earn credits or discounts when my referral completes their first booking,
**So that** I am rewarded for bringing new users to the platform.

**Acceptance Criteria:**
- Given my referral signs up, When they complete their first paid booking, Then I receive a reward (e.g., GBP 10 credit)
- Given I earn a credit, When I next book a lesson, Then I can apply the credit to reduce the price
- Given the referred user books, When the reward triggers, Then the new user also receives a welcome discount
- Given I have referred multiple people, When I view my referral page, Then I see a history of referrals and earned rewards


---

## Feature 18: Mobile Native Apps

**Priority:** P3 (Future)

**Epic:** As a user, I want native iOS and Android apps with push notifications so that I can manage my bookings and messages on the go.

### User Stories

#### US-18.1: Native App Experience
**As a** learner driver or instructor,
**I want to** access KerbSide as a native mobile app,
**So that** I get a smoother experience with device-native features.

**Acceptance Criteria:**
- Given I download the app, When I open it, Then I see the same functionality as the web version optimised for mobile
- Given I am on mobile, When I interact with the app, Then gestures, transitions, and navigation feel native to my platform (iOS/Android)
- Given I have an account, When I sign in on the app, Then my session persists between app opens

#### US-18.2: Push Notifications
**As a** platform user,
**I want to** receive push notifications for bookings, messages, and cancellations,
**So that** I never miss important updates.

**Acceptance Criteria:**
- Given I have the app installed, When a new booking is confirmed, Then I receive a push notification
- Given I have the app installed, When I receive a new message, Then I receive a push notification
- Given my instructor cancels, When the cancellation fires, Then I receive an immediate push notification with replacement suggestions
- Given I want to control notifications, When I open settings, Then I can toggle notification types on/off

---

## Feature 19: Advanced Instructor Analytics

**Priority:** P3 (Future)

**Epic:** As a driving instructor, I want detailed analytics about my earnings, utilisation, and demand so that I can optimise my schedule and grow my business.

### User Stories

#### US-19.1: Earnings Dashboard
**As a** driving instructor,
**I want to** see detailed earnings analytics including trends and breakdowns,
**So that** I understand my income patterns and can plan financially.

**Acceptance Criteria:**
- Given I am on my analytics page, When the dashboard loads, Then I see total earnings (weekly, monthly, yearly) with trend graphs
- Given I view earnings, When I see the breakdown, Then it shows earnings per student, per day of week, and commission paid
- Given I view trends, When comparing periods, Then I see growth/decline percentages

#### US-19.2: Utilisation and Demand Insights
**As a** driving instructor,
**I want to** see which time slots are most in demand,
**So that** I can adjust my availability to maximise bookings.

**Acceptance Criteria:**
- Given I am on analytics, When I view "Demand Insights", Then I see a heatmap of when students most commonly search and book
- Given I see demand data, When popular times are highlighted, Then I can compare against my current availability
- Given I view utilisation, When the metric calculates, Then it shows booked hours vs available hours as a percentage
- Given low-demand slots are identified, When displayed, Then I receive suggestions to move availability to higher-demand times


---

## Feature 20: Multi-Language UI

**Priority:** P3 (Future)

**Epic:** As a non-native English speaker, I want to use the platform in my preferred language so that I can navigate and understand all features without language barriers.

### User Stories

#### US-20.1: Language Selection
**As a** platform user (like Amir who speaks Urdu),
**I want to** switch the entire interface to my preferred language,
**So that** I can use the platform comfortably in my native tongue.

**Acceptance Criteria:**
- Given I am on any page, When I click the language selector, Then I see available languages (English, Welsh, Urdu, Polish, Hindi, Arabic)
- Given I select a language, When the page reloads, Then all UI labels, buttons, and system messages are displayed in that language
- Given I set a language preference, When I return to the site, Then my preference is remembered

#### US-20.2: Bilingual Content
**As a** platform user,
**I want** user-generated content (reviews, bios) to remain in their original language with an option to translate,
**So that** I can read authentic content while understanding it.

**Acceptance Criteria:**
- Given I view a review written in English while using Urdu interface, When displayed, Then the review shows in its original language
- Given I view content in another language, When I click "Translate", Then an automatic translation is shown below the original
- Given instructor bios are in English, When I use a non-English interface, Then system labels are translated but the bio remains original with a translate option

---

## Feature 21: Accessibility Features

**Priority:** P3 (Future)

**Epic:** As a user with accessibility needs, I want the platform to meet WCAG 2.1 AA standards so that I can use all features regardless of disability.

### User Stories

#### US-21.1: Screen Reader Support
**As a** visually impaired user,
**I want** all interactive elements to have proper ARIA labels and semantic HTML,
**So that** my screen reader can navigate the platform effectively.

**Acceptance Criteria:**
- Given I use a screen reader, When I navigate the site, Then all buttons, links, and form elements have descriptive ARIA labels
- Given I am on the booking calendar, When I navigate with keyboard, Then each slot is announced with its day, time, and availability status
- Given progress bars are shown, When the screen reader encounters them, Then it reads "Skill: [name], Level: [n] of 5, [description]"

#### US-21.2: High Contrast Mode
**As a** user with low vision,
**I want to** toggle a high contrast mode,
**So that** I can distinguish UI elements more easily.

**Acceptance Criteria:**
- Given I am on any page, When I toggle "High Contrast" in settings, Then the colour scheme switches to high-contrast (dark backgrounds, bright text, clear borders)
- Given high contrast is active, When I view all pages, Then minimum contrast ratio is 7:1 (WCAG AAA for text)
- Given I set high contrast, When I return later, Then my preference persists

#### US-21.3: Keyboard Navigation
**As a** user who cannot use a mouse,
**I want to** navigate the entire platform using only my keyboard,
**So that** I can access all functionality without a pointing device.

**Acceptance Criteria:**
- Given I press Tab, When navigating the page, Then focus moves through all interactive elements in logical order
- Given I am on the calendar, When I use arrow keys, Then I can move between time slots
- Given a modal is open, When I press Escape, Then the modal closes and focus returns to the trigger element
- Given I am booking, When I complete the full flow, Then every step is achievable using only keyboard input


---

## Feature 22: Admin Moderation Tools

**Priority:** P3 (Future)

**Epic:** As a platform administrator, I want comprehensive moderation tools so that I can ensure quality, safety, and policy compliance across the marketplace.

### User Stories

#### US-22.1: Content Moderation Queue
**As an** admin,
**I want to** review flagged content (reviews, messages, profiles) in a moderation queue,
**So that** I can remove inappropriate or policy-violating content.

**Acceptance Criteria:**
- Given content is flagged (by users or automated filters), When I open the moderation queue, Then I see all flagged items with context
- Given I review a flagged item, When I click "Remove", Then the content is hidden from public view and the author is notified
- Given I review a flagged item, When I click "Approve", Then the flag is cleared and the content remains visible
- Given I take action, When moderation is logged, Then an audit trail records who took what action and when

#### US-22.2: User Management
**As an** admin,
**I want to** suspend or ban user accounts,
**So that** I can protect the community from bad actors.

**Acceptance Criteria:**
- Given I search for a user, When I find their account, Then I see their full profile, booking history, and any flags
- Given I decide to suspend a user, When I click "Suspend" with a reason, Then the user cannot log in and sees a suspension message
- Given I decide to ban a user permanently, When I click "Ban", Then their profile is removed from search results and all active bookings are cancelled with refunds
- Given I suspend a user, When the suspension period expires, Then access is automatically restored

#### US-22.3: Platform Analytics
**As an** admin,
**I want to** view platform-wide analytics and health metrics,
**So that** I can monitor growth, identify issues, and make data-driven decisions.

**Acceptance Criteria:**
- Given I am on the admin dashboard, When the page loads, Then I see key metrics: total users, active bookings, revenue, match rate, and completion rate
- Given I view analytics, When I select a date range, Then all metrics update to reflect that period
- Given I see a metric declining, When I drill down, Then I can see the breakdown by region, user type, and time period

---

## Feature 23: Dispute Resolution System

**Priority:** P3 (Future)

**Epic:** As a platform user, I want a structured dispute resolution process so that issues between students and instructors can be fairly mediated.

### User Stories

#### US-23.1: Raise a Dispute
**As a** learner driver or instructor,
**I want to** raise a dispute about a booking or payment,
**So that** the platform can investigate and resolve the issue fairly.

**Acceptance Criteria:**
- Given I have a completed or cancelled booking, When I click "Raise Dispute", Then I see a form to describe the issue
- Given I fill out the dispute form, When I select a category (no-show, quality issue, payment problem, safety concern) and describe the issue, Then my dispute is submitted
- Given I submit a dispute, When it is created, Then both parties and the admin team are notified
- Given I submit evidence (screenshots, messages), When uploaded, Then they are attached to the dispute case

#### US-23.2: Admin Mediation
**As an** admin,
**I want to** review disputes with full context and make a resolution decision,
**So that** both parties feel the outcome is fair.

**Acceptance Criteria:**
- Given a dispute is raised, When I open it in the admin panel, Then I see the full booking details, both party profiles, messages, and submitted evidence
- Given I review the case, When I make a decision, Then I can choose: refund student, pay instructor, partial refund, or dismiss
- Given I make a decision, When I submit with a written explanation, Then both parties are notified of the outcome
- Given a decision involves a refund, When processed, Then the payment adjustment is automatically applied via Stripe

#### US-23.3: Dispute Tracking
**As a** platform user who raised a dispute,
**I want to** track the status of my case,
**So that** I know when to expect a resolution.

**Acceptance Criteria:**
- Given I raised a dispute, When I view "My Disputes", Then I see the status (Open, Under Review, Resolved, Dismissed)
- Given my dispute is under review, When the admin requests more information, Then I receive a notification and can respond
- Given my dispute is resolved, When I view the outcome, Then I see the decision, explanation, and any financial adjustments
- Given the dispute is resolved, When I receive the notification, Then I can acknowledge or appeal (one appeal allowed)

---

## Summary Table

| Feature | Priority | Stories | Key Persona |
|---------|----------|---------|-------------|
| 1. Instructor Onboarding & Profiles | P0 | 5 | Dave, Priya |
| 2. Student Sign-up & Match Profile | P0 | 5 | Sarah, Amir |
| 3. Smart Matching Engine | P0 | 4 | All students |
| 4. Live Availability Calendar | P0 | 4 | Dave, Priya |
| 5. Booking & Payments | P0 | 5 | All users |
| 6. Verified Reviews | P1 | 3 | Sarah, Amir |
| 7. Student Progress Dashboard | P1 | 4 | Sarah, Priya |
| 8. In-App Messaging | P1 | 4 | All users |
| 9. Instructor Continuity | P1 | 3 | All students |
| 10. Theory + Practical Integration | P2 | 2 | Amir |
| 11. Buddy System | P2 | 2 | Sarah, Amir |
| 12. DVSA Test Slot Alerts | P2 | 2 | All students |
| 13. Lesson Recap Videos | P2 | 2 | Priya |
| 14. "Test Ready" Certification | P2 | 2 | Priya, Sarah |
| 15. Block Booking Discounts | P2 | 2 | Dave, Amir |
| 16. Intensive Course Packages | P2 | 2 | Priya |
| 17. Referral Programme | P3 | 2 | All users |
| 18. Mobile Native Apps | P3 | 2 | All users |
| 19. Advanced Instructor Analytics | P3 | 2 | Dave |
| 20. Multi-Language UI | P3 | 2 | Amir |
| 21. Accessibility Features | P3 | 3 | All users |
| 22. Admin Moderation Tools | P3 | 3 | Admin |
| 23. Dispute Resolution System | P3 | 3 | All users |
| **Total** | | **62** | |

