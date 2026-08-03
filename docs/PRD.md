# KerbSide - Product Requirements Document

## 1. Product Vision

KerbSide is a two-sided marketplace connecting UK driving instructors (ADIs and PDIs) with learner drivers. The platform uses intelligent preference-based matching to pair students with the best-fit instructor, while providing tools for booking, payments, progress tracking, and communication.

**Mission:** Make learning to drive less stressful and more personalized by matching every learner with an instructor who fits their needs - not just whoever is closest.

**Core Differentiators:**
- Smart 8-factor matching engine (not just location proximity)
- Progress tracking with instructor notes and skill trees
- Instructor continuity guarantee (auto-replacement on cancellation)
- Privacy-gated messaging (booking required)
- Transparent pricing with Stripe Connect payments

---

## 2. Target Market

### Geography
UK-wide from day one. No regional restrictions. Postcode-based matching ensures local relevance.

### Market Size
- ~45,000 ADIs registered in the UK
- ~700,000+ practical driving tests taken annually
- Average learner takes 45 hours of professional lessons

### Go-to-Market Strategy
1. **Supply-first:** Onboard instructors before students
2. **Instructor value prop:** Free profile, booking management, payment processing, student pipeline
3. **Student value prop:** Find your perfect-fit instructor in seconds, track your progress, continuity guarantee
4. **Initial acquisition:** Target ADI forums, social media groups, local driving school partnerships

---

## 3. User Personas

### Persona 1: Sarah - Anxious Learner (Age 25)
- Failed her test once and lost confidence
- Needs a patient, female instructor
- Wants structured learning with visible progress
- Values anxiety-friendly teaching above all else
- Budget: mid-range, prefers block bookings

### Persona 2: Amir - International Student (Age 21)
- Speaks English as a second language (native: Urdu)
- Wants instruction in his first language
- Prefers automatic car
- Needs flexible scheduling around lectures
- Budget-conscious, books hourly

### Persona 3: Dave - Experienced ADI (Age 48)
- 15 years experience, high pass rate
- Teaches manual and automatic
- Wants more students without referral fees to aggregators
- Values simple booking and payment tools
- Wants to fill gaps in his schedule

### Persona 4: Priya - New PDI (Age 29)
- Recently qualified, building her client base
- Specializes in nervous drivers and intensive courses
- Speaks English and Hindi
- Needs visibility and reviews to establish reputation
- Wants progress tracking tools to differentiate herself

---

## 4. Feature Breakdown

### 4.1 MVP Features (Implemented)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | Instructor Onboarding & Profiles | Multi-step registration, ADI number verification, profile setup (bio, photo, specialisms, rates, coverage areas) | P0 |
| 2 | Student Sign-up & Match Profile | Registration with preference capture (gender, language, style, car, anxiety, location, goals) | P0 |
| 3 | Smart Matching Engine | 8-factor weighted scoring algorithm producing 0-100 compatibility scores | P0 |
| 4 | Live Availability Calendar | Instructor-managed weekly slots (recurring and one-off), day/time selection for bookings | P0 |
| 5 | Booking & Payments | Full booking flow with Stripe Connect, 15% platform commission, automatic instructor payouts | P0 |
| 6 | Verified Reviews | Post-lesson reviews tied to completed bookings only (no fake reviews) | P1 |
| 7 | Student Progress Dashboard | Skill tracking (1-5 levels), instructor notes, lesson history, visual progress | P1 |
| 8 | In-App Messaging | Privacy-gated messaging (requires active booking), conversation threads | P1 |
| 9 | Instructor Continuity | Auto-replacement suggestions when an instructor cancels, preserving student preferences | P1 |

### 4.2 Post-MVP Features (Planned)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 10 | Theory + Practical Integration | Theory test prep pipeline, quiz bank, progress tracking toward theory pass | P2 |
| 11 | Buddy System | Match learners at similar stages for peer support and motivation | P2 |
| 12 | DVSA Test Slot Alerts | Monitor and notify when test slots become available in the student's area | P2 |
| 13 | Lesson Recap Videos | Instructor uploads short video recaps after each lesson for student review | P2 |
| 14 | "Test Ready" Certification | Instructor marks student as ready for test, visible badge on profile | P2 |
| 15 | Block Booking Discounts | 5-lesson and 10-lesson packages with automatic discount tiers | P2 |
| 16 | Intensive Course Packages | Multi-day intensive course creation and scheduling by instructors | P2 |
| 17 | Referral Programme | Reward existing users for referring new students/instructors | P3 |
| 18 | Mobile Native Apps | iOS and Android apps with push notifications | P3 |
| 19 | Advanced Instructor Analytics | Earnings dashboards, utilization rates, demand forecasting, popular times | P3 |
| 20 | Multi-Language UI | Full interface translation (Welsh, Urdu, Polish, Hindi, Arabic) | P3 |
| 21 | Accessibility Features | WCAG 2.1 AA compliance, screen reader support, high contrast mode | P3 |
| 22 | Admin Moderation Tools | Content moderation, dispute queue, user management, platform analytics | P3 |
| 23 | Dispute Resolution System | Structured dispute flow with evidence upload and admin mediation | P3 |

---

## 5. User Roles & Permissions

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **Student** | Browse instructors, view matches, book lessons, send messages (with booking), leave reviews, track progress | Edit instructor profiles, manage other students, access admin |
| **Instructor** | Manage own profile, set availability, accept/decline bookings, send messages, log progress, view earnings | Book other instructors, access admin, modify student profiles |
| **Admin** | Verify ADI numbers, moderate content, manage users, view platform analytics, resolve disputes | Book lessons (as student), impersonate users |

---

## 6. Success Metrics

### North Star Metric
**Completed lessons per week** - measures both supply health (instructors active) and demand conversion (students booking and attending).

### Key Performance Indicators

| Metric | Target (Month 3) | Target (Month 12) |
|--------|-------------------|---------------------|
| Active instructors (1+ booking/month) | 100 | 1,000 |
| Active students (1+ booking/month) | 300 | 5,000 |
| Match acceptance rate | 60% | 75% |
| Booking completion rate | 85% | 92% |
| Average instructor rating | 4.3/5 | 4.5/5 |
| Instructor churn (monthly) | <10% | <5% |
| Student NPS | 40+ | 55+ |
| Platform GMV (monthly) | GBP 15,000 | GBP 200,000 |
| Revenue (15% commission) | GBP 2,250 | GBP 30,000 |

### Funnel Metrics
1. **Visit to Sign-up:** 15% target
2. **Sign-up to Profile Complete:** 70% target
3. **Profile to First Match View:** 85% target
4. **Match View to First Booking:** 40% target
5. **First Booking to Second Booking:** 65% target (retention signal)

---

## 7. Matching Algorithm Overview

The smart matching engine is KerbSide's core differentiator. It scores instructors against student preferences across 8 weighted factors:

| Factor | Weight | Score Logic |
|--------|--------|-------------|
| Location | 25% | Exact postcode match = 100, partial prefix = 50, no match = 0 |
| Gender Preference | 15% | No preference = 100, match = 100, mismatch = 0 |
| Language | 15% | Language in instructor's list = 100, not found = 0 |
| Teaching Style | 15% | Exact match = 100, ADAPTIVE instructor = 75, mismatch = 0 |
| Car Type | 10% | Match or BOTH = 100, mismatch = 0 |
| Availability Overlap | 10% | Pattern matching (weekdays/weekends/mornings/evenings) against instructor slots |
| Anxiety-Friendly | 5% | Student needs it and instructor offers it = 100, not needed = 100, needed but not offered = 0 |
| Specialisms | 5% | 3+ specialisms = 100, 1-2 = 75, none = 50 |

**Total: 100% (weights sum to 1.0)**

Results are sorted by overall score (descending) and the top 10 are returned to the student.

---

## 8. Payment Model

### Commission Structure
- **Platform fee:** 15% of lesson price
- **Instructor receives:** 85% of lesson price
- **Payment method:** Stripe Connect (Express accounts)
- **Currency:** GBP only (UK market)
- **Minimum lesson price:** GBP 20/hour
- **Maximum lesson price:** GBP 100/hour

### Payment Flow
1. Student books a lesson
2. Stripe PaymentIntent created with `application_fee_amount` (15%)
3. Student completes payment (card)
4. On payment success: booking moves to CONFIRMED
5. On lesson completion: funds automatically transfer to instructor via destination charges
6. Refunds: full refund on cancellation before lesson time

---

## 9. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page load time | < 2s (First Contentful Paint) |
| API response time (p95) | < 500ms |
| Uptime | 99.5% |
| Data encryption | TLS 1.3 in transit, AES-256 at rest |
| GDPR compliance | Full (data export, deletion, consent) |
| Accessibility | WCAG 2.1 Level AA (post-MVP) |
| Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| Mobile responsive | Yes (all pages) |
| Max concurrent users | 1,000 (initial infrastructure) |

---

## 10. Assumptions & Constraints

### Assumptions
- Instructors will self-serve their profiles and availability
- Students know their basic preferences (car type, rough location, anxiety needs)
- ADI verification at "moderate" level (number validation, not full DBS check at MVP)
- Stripe Connect onboarding is acceptable friction for instructors
- UK market only (GBP, UK postcodes, English as primary language)

### Constraints
- No native mobile apps at MVP (responsive web only)
- No real-time features (WebSocket) at MVP - messaging uses polling/refresh
- No video calling or live tracking
- No integration with DVSA systems at MVP
- Payment holds are not implemented (immediate charge model)

---

## 11. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low instructor supply at launch | High | Medium | Pre-launch outreach, free tier for early adopters, no subscription fee |
| Fake/unverified instructors | High | Low | ADI number validation, manual review option, verified badge |
| Students booking off-platform after matching | Medium | Medium | Value-add features (progress tracking, continuity), easy rebooking |
| Stripe Connect onboarding friction | Medium | Medium | Clear guidance, progress indicators, fallback to manual payouts |
| Match quality issues | High | Low | Feedback loop, score refinement, "not a good match" reporting |

---

## 12. Release Plan

### Phase 1: MVP Launch (Current)
- All 9 core features live
- Instructor sign-up open (free)
- Student registration with matching
- Booking and payments via Stripe
- Basic reviews and messaging

### Phase 2: Retention & Engagement (Month 2-4)
- Block booking discounts
- Intensive course packages
- "Test Ready" certification
- Enhanced progress dashboard

### Phase 3: Growth & Expansion (Month 4-8)
- Theory integration
- Buddy system
- Referral programme
- Advanced analytics for instructors

### Phase 4: Scale (Month 8-12)
- Mobile native apps
- Multi-language support
- DVSA integration
- Admin moderation suite
- Dispute resolution

---

## 13. Glossary

| Term | Definition |
|------|------------|
| ADI | Approved Driving Instructor - fully qualified, green badge |
| PDI | Potential Driving Instructor - trainee with pink badge, can charge |
| DVSA | Driver and Vehicle Standards Agency |
| Smart Match | KerbSide's proprietary matching algorithm |
| Continuity Guarantee | Platform promise to suggest replacement if instructor cancels |
| Coverage Postcodes | List of UK postcode areas where an instructor is willing to pick up students |
| Anxiety-Friendly | Instructor self-declares expertise in teaching nervous/anxious learners |
| Specialism | Additional teaching areas (motorway, night driving, refresher, etc.) |
