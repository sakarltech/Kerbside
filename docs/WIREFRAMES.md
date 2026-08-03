# KerbSide - Wireframes & Mockups

## Overview

This document contains text-based wireframes and mockups for all key screens in the KerbSide marketplace platform. These wireframes represent the layout and content structure of each screen.

---

## 1. Landing Page

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]          Home  How It Works  Pricing  Sign In  |
+------------------------------------------------------------------+
|                                                                    |
|              Find Your Perfect Driving Instructor                  |
|                                                                    |
|    Smart matching connects you with an instructor who fits         |
|    your style, schedule, and learning needs.                       |
|                                                                    |
|    [  Find My Instructor  ]    [  I'm an Instructor  ]            |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|   HOW IT WORKS                                                     |
|                                                                    |
|   +------------------+  +------------------+  +------------------+ |
|   |    1. TELL US    |  |   2. GET MATCHED |  |   3. BOOK &      | |
|   |   YOUR NEEDS     |  |                  |  |   LEARN          | |
|   |                  |  |                  |  |                  | |
|   | Share your       |  | Our 8-factor     |  | Book your first  | |
|   | preferences:     |  | algorithm finds  |  | lesson, pay      | |
|   | location, style, |  | your best-fit    |  | securely, and    | |
|   | car, language    |  | instructor       |  | track progress   | |
|   +------------------+  +------------------+  +------------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|   WHY KERBSIDE?                                                    |
|                                                                    |
|   [*] Smart Matching       - 8-factor compatibility scoring        |
|   [*] Progress Tracking    - Visual skill trees, 1-5 levels       |
|   [*] Verified Reviews     - Only from real, completed lessons    |
|   [*] Continuity Guarantee - Auto-replacement if cancelled        |
|   [*] Secure Payments      - Stripe Connect, transparent pricing  |
|   [*] Privacy First        - Messaging only with active booking   |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|   WHAT OUR USERS SAY                                               |
|                                                                    |
|   "KerbSide matched me with Priya who was so patient.             |
|    I passed first time!" - Sarah, London                          |
|                                                                    |
|   "I filled all my gaps within a week. Simple and effective."     |
|    - Dave, Manchester                                             |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|   READY TO START?                                                  |
|                                                                    |
|       [  Find My Instructor  ]   [  Join as Instructor  ]         |
|                                                                    |
+------------------------------------------------------------------+
|  KerbSide (c) 2024  |  Terms  |  Privacy  |  Contact  |  Help    |
+------------------------------------------------------------------+
```

---

## 2. Instructor Registration (Multi-Step)

### Step 1: Account Details

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   CREATE YOUR INSTRUCTOR ACCOUNT                                   |
|                                                                    |
|   Step: [1]---[2]---[3]---[4]---[5]                               |
|         ^^^                                                        |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   Full Name *                                        |        |
|   |   [_____________________________________________]    |        |
|   |                                                      |        |
|   |   Email Address *                                    |        |
|   |   [_____________________________________________]    |        |
|   |                                                      |        |
|   |   Password *                                         |        |
|   |   [_____________________________________________]    |        |
|   |   (Min 8 characters, mixed case, 1 digit)           |        |
|   |                                                      |        |
|   |   Phone Number                                       |        |
|   |   [_____________________________________________]    |        |
|   |                                                      |        |
|   |                              [  Continue -->  ]      |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   Already have an account? [Sign In]                               |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 2: Professional Information

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   PROFESSIONAL DETAILS                                             |
|                                                                    |
|   Step: [1]---[2]---[3]---[4]---[5]                               |
|               ^^^                                                  |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   ADI Number *                                       |        |
|   |   [______] (6 digits)                                |        |
|   |                                                      |        |
|   |   Teaching Style *                                   |        |
|   |   ( ) Patient    ( ) Intensive   ( ) Structured      |        |
|   |   ( ) Relaxed    ( ) Adaptive                        |        |
|   |                                                      |        |
|   |   Car Type *                                         |        |
|   |   ( ) Manual     ( ) Automatic   ( ) Both           |        |
|   |                                                      |        |
|   |   Hourly Rate (GBP) *                                |        |
|   |   [______] (20-100)                                  |        |
|   |                                                      |        |
|   |   [<-- Back]                     [  Continue -->  ]  |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 3: Profile Setup

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   BUILD YOUR PROFILE                                               |
|                                                                    |
|   Step: [1]---[2]---[3]---[4]---[5]                               |
|                     ^^^                                            |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   Bio (max 500 characters) *                         |        |
|   |   [                                              ]   |        |
|   |   [                                              ]   |        |
|   |   [______________________________________________]   |        |
|   |                                         345/500      |        |
|   |                                                      |        |
|   |   Gender                                             |        |
|   |   [v Select...               ]                       |        |
|   |                                                      |        |
|   |   Languages Spoken (min 1) *                         |        |
|   |   [English] [x]  [Hindi] [x]  [+ Add]               |        |
|   |                                                      |        |
|   |   Specialisms                                        |        |
|   |   [x] Nervous Drivers  [ ] Motorway                  |        |
|   |   [ ] Night Driving     [ ] Refresher                |        |
|   |   [x] Intensive         [ ] Pass Plus                |        |
|   |                                                      |        |
|   |   [x] I am anxiety-friendly certified                |        |
|   |                                                      |        |
|   |   Coverage Postcodes (min 1) *                       |        |
|   |   [SW1] [x]  [SW2] [x]  [W1] [x]  [+ Add]          |        |
|   |                                                      |        |
|   |   [<-- Back]                     [  Continue -->  ]  |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 4: Availability Setup

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   SET YOUR AVAILABILITY                                            |
|                                                                    |
|   Step: [1]---[2]---[3]---[4]---[5]                               |
|                           ^^^                                      |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |        Mon   Tue   Wed   Thu   Fri   Sat   Sun       |        |
|   |  06:00  .     .     .     .     .     .     .        |        |
|   |  07:00  .     .     .     .     .     .     .        |        |
|   |  08:00  .    [##]   .    [##]   .    [##]   .        |        |
|   |  09:00  .    [##]   .    [##]   .    [##]   .        |        |
|   |  10:00 [##]  [##]  [##]  [##]   .    [##]   .        |        |
|   |  11:00 [##]  [##]  [##]  [##]   .     .     .        |        |
|   |  12:00 [##]   .    [##]   .     .     .     .        |        |
|   |  13:00  .     .     .     .     .     .     .        |        |
|   |  14:00  .    [##]   .    [##]  [##]   .     .        |        |
|   |  15:00  .    [##]   .    [##]  [##]   .     .        |        |
|   |  16:00  .     .     .     .    [##]   .     .        |        |
|   |  ...                                                 |        |
|   |                                                      |        |
|   |  [##] = Available    .  = Not set                    |        |
|   |                                                      |        |
|   |  Click a cell to add/remove availability             |        |
|   |  [x] Recurring weekly    [ ] One-off date: [______]  |        |
|   |                                                      |        |
|   |  Slots added: 14                                     |        |
|   |                                                      |        |
|   |   [<-- Back]                     [  Continue -->  ]  |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
```

### Step 5: Stripe Connect

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   SET UP PAYMENTS                                                  |
|                                                                    |
|   Step: [1]---[2]---[3]---[4]---[5]                               |
|                                 ^^^                                |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   Connect your bank account to receive payments      |        |
|   |   from students. We use Stripe for secure payouts.   |        |
|   |                                                      |        |
|   |   How it works:                                      |        |
|   |   - Students pay through the platform                |        |
|   |   - You receive 85% of each lesson fee               |        |
|   |   - Payouts arrive in your bank automatically        |        |
|   |   - 15% platform fee covers matching + support       |        |
|   |                                                      |        |
|   |          [  Connect with Stripe  ]                   |        |
|   |                                                      |        |
|   |   Or [Skip for now] (you can set up later)           |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 3. Student Registration with Preferences

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]                                       Sign In   |
+------------------------------------------------------------------+
|                                                                    |
|   FIND YOUR PERFECT INSTRUCTOR                                     |
|                                                                    |
|   Tell us about yourself so we can match you with the best        |
|   driving instructor for your needs.                              |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   --- Your Details ---                               |        |
|   |                                                      |        |
|   |   Full Name *        [_________________________]     |        |
|   |   Email Address *    [_________________________]     |        |
|   |   Password *         [_________________________]     |        |
|   |                                                      |        |
|   |   --- Your Location ---                              |        |
|   |                                                      |        |
|   |   Postcode *         [_______]                       |        |
|   |   Pickup Flexibility [==|====] 5 km                  |        |
|   |                                                      |        |
|   |   --- Instructor Preferences ---                     |        |
|   |                                                      |        |
|   |   Preferred Gender                                   |        |
|   |   ( ) Male  ( ) Female  (*) No Preference            |        |
|   |                                                      |        |
|   |   Preferred Language  [v English           ]         |        |
|   |                                                      |        |
|   |   Teaching Style                                     |        |
|   |   ( ) Patient  ( ) Intensive  ( ) Structured         |        |
|   |   ( ) Relaxed  (*) No Preference                     |        |
|   |                                                      |        |
|   |   Car Type                                           |        |
|   |   ( ) Manual  ( ) Automatic  (*) No Preference       |        |
|   |                                                      |        |
|   |   [x] I need an anxiety-friendly instructor          |        |
|   |                                                      |        |
|   |   --- Lesson Preferences ---                         |        |
|   |                                                      |        |
|   |   Format:  (*) Hourly  ( ) Block of 5  ( ) Block 10 |        |
|   |                                                      |        |
|   |   Goal Timeline                                      |        |
|   |   [Pass within 3 months________________]             |        |
|   |                                                      |        |
|   |   Availability                                       |        |
|   |   [Weekday evenings after 5pm__________]             |        |
|   |                                                      |        |
|   |              [  Find My Matches  ]                   |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   Already have an account? [Sign In]                               |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 4. Match Results Page

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|                                                                    |
|   YOUR TOP MATCHES                           [Refresh Matches]    |
|                                                                    |
|   +--- Filters ----+                                              |
|   | Max Price: [40] |                                              |
|   | Min Rating:[4*] |                                              |
|   | Days:          |                                              |
|   | [x]Mon [x]Tue  |                                              |
|   | [x]Wed [ ]Thu  |                                              |
|   | [ ]Fri [x]Sat  |                                              |
|   | [ ] Verified   |                                              |
|   +-----------------+                                              |
|                                                                    |
|   +------------------------------------------------------+        |
|   | #1  [Photo]  Priya S.            87% MATCH  [Verified]|        |
|   |                                                      |        |
|   |     GBP 35/hr | Automatic | Patient | Hindi, English  |        |
|   |                                                      |        |
|   |     Location:  [========90========] 90%              |        |
|   |     Gender:    [=======100========] 100%             |        |
|   |     Language:  [=======100========] 100%             |        |
|   |     Style:     [=======100========] 100%             |        |
|   |     Car:       [=======100========] 100%             |        |
|   |     Schedule:  [====60============] 60%              |        |
|   |     Anxiety:   [=======100========] 100%             |        |
|   |     Specialisms:[=====75==========] 75%              |        |
|   |                                                      |        |
|   |     [  View Profile  ]    [  Book Now  ]             |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   +------------------------------------------------------+        |
|   | #2  [Photo]  Dave M.             72% MATCH           |        |
|   |                                                      |        |
|   |     GBP 38/hr | Both | Structured | English          |        |
|   |                                                      |        |
|   |     Location:  [========90========] 90%              |        |
|   |     Gender:    [===50=============] 50%              |        |
|   |     Language:  [=======100========] 100%             |        |
|   |     Style:     [==0===============] 0%               |        |
|   |     Car:       [=======100========] 100%             |        |
|   |     Schedule:  [======80==========] 80%              |        |
|   |     Anxiety:   [==0===============] 0%               |        |
|   |     Specialisms:[=======100=======] 100%             |        |
|   |                                                      |        |
|   |     [  View Profile  ]    [  Book Now  ]             |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   Showing 1-10 of 23 matches                                      |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 5. Instructor Public Profile

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|                                                                    |
|   +-------------------+  +-----------------------------------+    |
|   |                   |  |                                   |    |
|   |   [  PHOTO  ]     |  |  Priya Sharma          [Verified] |    |
|   |                   |  |                                   |    |
|   |   **** (4.8)      |  |  Patient | Automatic | GBP 35/hr  |    |
|   |   12 reviews      |  |                                   |    |
|   |                   |  |  Languages: English, Hindi         |    |
|   +-------------------+  |  Areas: SW1, SW2, W1, W2           |    |
|                          |                                   |    |
|                          |  Bio:                              |    |
|                          |  "I specialise in helping nervous  |    |
|                          |  drivers build confidence. 5 years |    |
|                          |  experience with 89% pass rate."   |    |
|                          +-----------------------------------+    |
|                                                                    |
|   SPECIALISMS                                                      |
|   [Nervous Drivers] [Intensive] [Night Driving]                    |
|                                                                    |
|   AVAILABILITY PREVIEW                                             |
|   +------+------+------+------+------+------+------+              |
|   | Mon  | Tue  | Wed  | Thu  | Fri  | Sat  | Sun  |              |
|   | 10-12| 8-12 | 10-12| 8-12 | --   | 8-12 | --   |              |
|   | --   | 14-16|  --  | 14-16| 14-17|  --  |  --  |              |
|   +------+------+------+------+------+------+------+              |
|                                                                    |
|           [  Book a Lesson with Priya  ]                           |
|                                                                    |
|   REVIEWS (12)                                                     |
|   +------------------------------------------------------+        |
|   | ***** Sarah M. - 2 days ago                [Verified] |        |
|   | "Priya was incredibly patient. I felt safe the whole  |        |
|   |  time and my confidence has grown so much."           |        |
|   +------------------------------------------------------+        |
|   | **** Amir K. - 1 week ago                  [Verified] |        |
|   | "Great instructor, speaks Hindi which helped me       |        |
|   |  understand complex road rules much better."          |        |
|   +------------------------------------------------------+        |
|   | [Show More Reviews]                                   |        |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 6. Booking Flow (Slot Selection to Payment)

### Step A: Select Time Slot

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|                                                                    |
|   BOOK A LESSON WITH PRIYA S.                                      |
|                                                                    |
|   Select a date and time:                                          |
|                                                                    |
|   < January 2024 >                                                 |
|   +-----+-----+-----+-----+-----+-----+-----+                    |
|   | Mon | Tue | Wed | Thu | Fri | Sat | Sun |                    |
|   |     |  1  |  2  |  3  |  4  |  5  |  6  |                    |
|   |  7  |  8  |  9  | 10  | 11  | 12  | 13  |                    |
|   | 14  | [15]| 16  | 17  | 18  | 19  | 20  |                    |
|   | 21  | 22  | 23  | 24  | 25  | 26  | 27  |                    |
|   | 28  | 29  | 30  | 31  |     |     |     |                    |
|   +-----+-----+-----+-----+-----+-----+-----+                    |
|                                                                    |
|   Available slots for Tuesday 15 Jan:                              |
|                                                                    |
|   [ 08:00 - 09:00 ]  (available)                                  |
|   [ 09:00 - 10:00 ]  (available)                                  |
|   [ 10:00 - 11:00 ]  (BOOKED)                                    |
|   [[11:00 - 12:00]]  <-- SELECTED                                |
|   [ 14:00 - 15:00 ]  (available)                                  |
|   [ 15:00 - 16:00 ]  (available)                                  |
|                                                                    |
|                         [  Continue to Details -->  ]              |
|                                                                    |
+------------------------------------------------------------------+
```

### Step B: Confirm Details & Pay

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|                                                                    |
|   CONFIRM YOUR BOOKING                                             |
|                                                                    |
|   +------------------------------------------------------+        |
|   |                                                      |        |
|   |   Instructor:   Priya Sharma                         |        |
|   |   Date:         Tuesday, 15 January 2024             |        |
|   |   Time:         11:00 - 12:00                        |        |
|   |                                                      |        |
|   |   Duration:     [v  60 minutes  ]                    |        |
|   |                                                      |        |
|   |   Lesson Notes (optional):                           |        |
|   |   [Practice roundabouts and mirror checks__]         |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   +------------------------------------------------------+        |
|   |   PRICE BREAKDOWN                                    |        |
|   |                                                      |        |
|   |   Lesson (60 min @ GBP 35/hr):       GBP 35.00      |        |
|   |   ----------------------------------------           |        |
|   |   Total:                              GBP 35.00      |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   +------------------------------------------------------+        |
|   |   PAYMENT                                            |        |
|   |                                                      |        |
|   |   Card Number                                        |        |
|   |   [4242 4242 4242 4242_______________]               |        |
|   |                                                      |        |
|   |   Expiry        CVC                                  |        |
|   |   [12/25]       [123]                                |        |
|   |                                                      |        |
|   |   Powered by [Stripe]                                |        |
|   |                                                      |        |
|   +------------------------------------------------------+        |
|                                                                    |
|           [  Confirm & Pay GBP 35.00  ]                           |
|                                                                    |
|   By paying you agree to our Terms of Service.                    |
|                                                                    |
+------------------------------------------------------------------+
```

### Step C: Confirmation

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|                                                                    |
|                       [Checkmark Icon]                             |
|                                                                    |
|              BOOKING CONFIRMED!                                    |
|                                                                    |
|   Your lesson with Priya Sharma is booked.                        |
|                                                                    |
|   +------------------------------------------------------+        |
|   |   Date:    Tuesday, 15 January 2024                  |        |
|   |   Time:    11:00 - 12:00                             |        |
|   |   Price:   GBP 35.00 (paid)                          |        |
|   +------------------------------------------------------+        |
|                                                                    |
|   What's next?                                                    |
|   - Your instructor has been notified                             |
|   - You can message Priya about pickup location                   |
|   - You'll receive a reminder before your lesson                  |
|                                                                    |
|   [  View My Bookings  ]    [  Message Instructor  ]              |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 7. Student Dashboard (with Progress)

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|  +----------+  +------------------------------------------------+ |
|  | SIDEBAR  |  |                                                | |
|  |          |  |  Welcome back, Sarah!                          | |
|  | Overview |  |                                                | |
|  | Matches  |  |  +--- NEXT LESSON ---+  +--- PROGRESS ---+    | |
|  | Bookings |  |  | Tue 15 Jan, 11:00 |  | Overall: 45%   |    | |
|  | Progress |  |  | Priya Sharma      |  | Skills: 7/12    |    | |
|  | Messages |  |  | [Message] [Cancel]|  | Level 4+: 3     |    | |
|  | Profile  |  |  +-------------------+  +-----------------+    | |
|  |          |  |                                                | |
|  +----------+  |  MY SKILL PROGRESS                             | |
|                |                                                | |
|                |  Moving Off & Stopping   [==========] 5/5 M    | |
|                |  Steering Control        [========  ] 4/5 P    | |
|                |  Use of Mirrors          [========  ] 4/5 P    | |
|                |  Signalling              [======    ] 3/5 C    | |
|                |  Junctions               [======    ] 3/5 C    | |
|                |  Roundabouts             [====      ] 2/5 D    | |
|                |  Parallel Parking        [====      ] 2/5 D    | |
|                |  Bay Parking             [==        ] 1/5 I    | |
|                |  Emergency Stop          [======    ] 3/5 C    | |
|                |                                                | |
|                |  Legend: I=Introduced D=Developing              | |
|                |          C=Competent P=Proficient M=Mastered    | |
|                |                                                | |
|                |  RECENT LESSON NOTES                           | |
|                |  +--------------------------------------------+| |
|                |  | 12 Jan - Priya S.                         || |
|                |  | Skills: Roundabouts (2), Junctions (3)     || |
|                |  | "Good progress on junctions today.         || |
|                |  |  Roundabouts need more practice - focus    || |
|                |  |  on checking right at entry."              || |
|                |  +--------------------------------------------+| |
|                |  | 8 Jan - Priya S.                           || |
|                |  | Skills: Mirrors (4), Signalling (3)        || |
|                |  | "Excellent mirror work now consistent.     || |
|                |  |  Signalling timing much improved."         || |
|                |  +--------------------------------------------+| |
|                |                                                | |
|                +------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

## 8. Instructor Dashboard (with Bookings/Earnings)

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|  +----------+  +------------------------------------------------+ |
|  | SIDEBAR  |  |                                                | |
|  |          |  |  Welcome back, Dave!             [Verified ADI] | |
|  | Overview |  |                                                | |
|  | Bookings |  |  +--- THIS WEEK ---+  +--- EARNINGS ---+      | |
|  | Calendar |  |  | 8 lessons booked |  | This month:    |      | |
|  | Earnings |  |  | 2 slots open     |  | GBP 1,247.50   |      | |
|  | Students |  |  | Next: Today 2pm  |  | (after fees)   |      | |
|  | Profile  |  |  +------------------+  +----------------+      | |
|  |          |  |                                                | |
|  +----------+  |  UPCOMING BOOKINGS                             | |
|                |                                                | |
|                |  +--------------------------------------------+| |
|                |  | TODAY - 14:00                    CONFIRMED || |
|                |  | Sarah Mitchell | 60 min | GBP 35           || |
|                |  | Notes: "Practice roundabouts please"       || |
|                |  | [Complete] [Cancel] [Message]               || |
|                |  +--------------------------------------------+| |
|                |  | TODAY - 16:00                    CONFIRMED || |
|                |  | Amir Khan | 60 min | GBP 35                || |
|                |  | Notes: "First lesson - nervous"            || |
|                |  | [Complete] [Cancel] [Message]               || |
|                |  +--------------------------------------------+| |
|                |  | TUE 16 JAN - 09:00              CONFIRMED || |
|                |  | James Wilson | 90 min | GBP 52.50          || |
|                |  | Notes: --                                  || |
|                |  | [Complete] [Cancel] [Message]               || |
|                |  +--------------------------------------------+| |
|                |                                                | |
|                |  EARNINGS SUMMARY                              | |
|                |  +--------------------------------------------+| |
|                |  | This Week:    GBP 315.00  (9 lessons)      || |
|                |  | This Month:   GBP 1,247.50 (38 lessons)    || |
|                |  | Commission:   GBP 220.15  (15%)            || |
|                |  | Pending:      GBP 105.00  (3 lessons)      || |
|                |  +--------------------------------------------+| |
|                |                                                | |
|                |  RECENT REVIEWS                                | |
|                |  ***** "Brilliant instructor!" - Sarah M.     | |
|                |  **** "Very helpful and clear" - Amir K.      | |
|                |                                                | |
|                +------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

## 9. Messaging Interface

```
+------------------------------------------------------------------+
|  [Logo: KerbSide]       Dashboard  Messages  Profile  Sign Out    |
+------------------------------------------------------------------+
|  +---------------------+  +-------------------------------------+ |
|  | CONVERSATIONS       |  | CHAT: Priya Sharma                  | |
|  |                     |  |                                     | |
|  | +---+ Priya Sharma  |  | +-----------------------------------+| |
|  | |[P]| "See you at.."|  | | Tue 14 Jan, 09:15                 || |
|  | +---+ 2 min ago     |  | |                                   || |
|  |      ^^^^ SELECTED  |  | |  [Priya]: Hi Sarah! Looking       || |
|  |                     |  | |  forward to our lesson tomorrow.   || |
|  | +---+ Dave Miller   |  | |  Any particular focus?             || |
|  | |[D]| "Great less.."|  | |                                   || |
|  | +---+ 3 days ago    |  | | Tue 14 Jan, 09:22                 || |
|  |                     |  | |                                   || |
|  | +---+ Admin         |  | |  [You]: Hi Priya! Can we work on  || |
|  | |[A]| "Your ADI h.."|  | |  roundabouts? They make me        || |
|  | +---+ 1 week ago    |  | |  really nervous.                  || |
|  |                     |  | |                                   || |
|  |                     |  | | Tue 14 Jan, 09:25                 || |
|  |                     |  | |                                   || |
|  |                     |  | |  [Priya]: Of course! We'll take   || |
|  |                     |  | |  it slowly. I'll plan a route     || |
|  |                     |  | |  with easy roundabouts first.     || |
|  |                     |  | |                                   || |
|  |                     |  | | Tue 15 Jan, 10:45                 || |
|  |                     |  | |                                   || |
|  |                     |  | |  [Priya]: See you at 11! I'll be  || |
|  |                     |  | |  in the blue Ford Fiesta.         || |
|  |                     |  | |                     Read [check]  || |
|  |                     |  | |                                   || |
|  |                     |  | +-----------------------------------+| |
|  |                     |  |                                     | |
|  |                     |  | +-----------------------------------+| |
|  |                     |  | | [Type a message...              ] || |
|  |                     |  | |                          [Send]   || |
|  |                     |  | +-----------------------------------+| |
|  +---------------------+  +-------------------------------------+ |
+------------------------------------------------------------------+
```

---

## 10. Admin Panel

```
+------------------------------------------------------------------+
|  [Logo: KerbSide ADMIN]                              Sign Out     |
+------------------------------------------------------------------+
|  +----------+  +------------------------------------------------+ |
|  | ADMIN    |  |                                                | |
|  |          |  |  PLATFORM OVERVIEW                             | |
|  | Overview |  |                                                | |
|  | Users    |  |  +--------+ +--------+ +--------+ +--------+  | |
|  | Verify   |  |  | USERS  | | ACTIVE | |BOOKINGS| |REVENUE |  | |
|  | Moderat. |  |  |  1,247 | |   834  | | 3,421  | |GBP 12k |  | |
|  | Analytics|  |  | +12%   | | +8%    | | +15%   | | +22%   |  | |
|  | Disputes |  |  +--------+ +--------+ +--------+ +--------+  | |
|  |          |  |                                                | |
|  +----------+  |  PENDING ADI VERIFICATIONS (7)                 | |
|                |                                                | |
|                |  +--------------------------------------------+| |
|                |  | Name           | ADI#   | Date    | Action || |
|                |  |----------------|--------|---------|--------|| |
|                |  | Mike Johnson   | 483921 | 12 Jan  |[A] [R] || |
|                |  | Lisa Chen      | 291847 | 11 Jan  |[A] [R] || |
|                |  | Ahmed Hassan   | 738291 | 10 Jan  |[A] [R] || |
|                |  | ...            |        |         |        || |
|                |  +--------------------------------------------+| |
|                |  [A] = Approve    [R] = Reject                 | |
|                |                                                | |
|                |  RECENT FLAGS (3)                              | |
|                |  +--------------------------------------------+| |
|                |  | Type    | Content        | Reporter | Date || |
|                |  |---------|----------------|----------|------|| |
|                |  | Review  | "Fake review"  | Dave M.  | Today|| |
|                |  | Profile | Inappropriate  | System   | Today|| |
|                |  | Message | Spam content   | Sarah M. | Yest || |
|                |  +--------------------------------------------+| |
|                |  [View Moderation Queue]                       | |
|                |                                                | |
|                |  PLATFORM HEALTH                               | |
|                |  Match Rate:     72% (target: 75%)             | |
|                |  Completion:     89% (target: 92%)             | |
|                |  Avg Rating:     4.4 (target: 4.5)             | |
|                |  Response Time:  245ms (target: 500ms)         | |
|                |                                                | |
|                +------------------------------------------------+ |
+------------------------------------------------------------------+
```

---

## Responsive Design Notes

All screens are designed mobile-first with these breakpoints:

| Breakpoint | Layout |
|-----------|--------|
| < 640px (mobile) | Single column, stacked cards, hamburger nav |
| 640-1024px (tablet) | Two columns where appropriate, sidebar collapses |
| > 1024px (desktop) | Full layout as shown in wireframes above |

### Mobile Adaptations

- Navigation becomes hamburger menu
- Dashboard sidebar becomes bottom tab bar
- Messaging: conversation list and chat are separate views (not side-by-side)
- Calendar: horizontal scroll on smaller screens
- Match cards: stacked vertically, full width
- Progress bars: full width with labels above

