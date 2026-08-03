# KerbSide MVP Production-Readiness Roadmap

**Status:** Proposed execution plan
**Launch gate:** Every launch-critical task below is complete, its acceptance criteria are evidenced in CI or a recorded launch check, and the go/no-go checklist passes.

This roadmap deliberately reduces scope to a safe, launchable marketplace. Post-MVP ideas in the PRD (packages, native apps, test-slot alerts, referrals, advanced analytics, etc.) are out of scope until after launch.

## Delivery rules

- Work in the order shown. A task may start only when its dependencies are complete.
- Every production behaviour needs an automated test at the lowest useful layer. Financial, permission, and state-machine behaviour also needs integration coverage.
- Do not expose a profile in search, matching, or booking until it is active: ADI approved, Stripe charges/transfers enabled, required profile data present, and at least one future availability window exists.
- Server-side code is the authority for price, availability, booking state, permissions, and Stripe state. Browser-submitted values are never trusted for these decisions.
- Each task must be reviewed and merged with its acceptance criteria met. No `TODO`, mock data, simulated success, or dead API route may remain in a launch-critical flow.

## Phase 0 — Scope, policy, and delivery foundation

### R0.1 Define the launch operating model

**Priority:** P0 · **Depends on:** none

- Choose the initial service area and whether it is ADIs only or also PDIs.
- Set booking/cancellation/refund rules, no-show handling, instructor cancellation policy, support hours, and dispute escalation.
- Define the minimum live profile requirements and the manual ADI verification evidence/process.
- Assign named owners for engineering, payment operations, customer support, and data protection.

**Done when:** a short policy document is approved and its rules are represented in product copy and acceptance tests.

### R0.2 Define production environments and ownership

**Priority:** P0 · **Depends on:** R0.1

- Establish local, preview, staging, and production environments with separate databases, Stripe accounts/webhook endpoints, secrets, and domains.
- Define who can deploy, access production data, rotate credentials, approve refunds, and administer instructor verification.
- Add an incident severity matrix, on-call/contact rota, rollback owner, and release communication channel.

**Done when:** access is least-privilege, production credentials are not used outside production, and the operational runbook is stored with the project.

## Phase 1 — Build, database, and deployment remediation

### R1.1 Make builds deterministic

**Priority:** P0 · **Depends on:** R0.2

- Create and commit the supported package-manager lockfile.
- Pin the Node/package-manager versions and add the package-manager field to `package.json`.
- Replace `npm install` in CI and Docker with `npm ci`; enable dependency caching in CI.
- Add dependency-update policy and scheduled vulnerability scanning.

**Done when:** a clean checkout builds with the pinned toolchain and produces the same dependency graph in CI and Docker.

### R1.2 Establish safe schema migration and recovery practices

**Priority:** P0 · **Depends on:** R1.1

- Stop ignoring `prisma/migrations/`; create and commit an initial migration matching the reviewed schema.
- Add `prisma migrate deploy` as an explicit, one-time deployment step before the application is started.
- Add a staging migration test, database backup schedule, encrypted backup retention, and restore drill.
- Document forward-only migration, rollback, and destructive-data-change procedures.

**Done when:** a blank staging database can be migrated, seeded only in non-production, backed up, restored, and migrated again using committed assets.

### R1.3 Repair and harden container/runtime configuration

**Priority:** P0 · **Depends on:** R1.1

- Fix the Dockerfile's nonexistent `public/` copy and validate standalone output.
- Remove insecure Compose defaults (known auth secret, exposed development database) from production usage.
- Add runtime environment validation which fails startup for missing/invalid production secrets and URLs.
- Add application liveness/readiness endpoints and production-safe shutdown/database-disconnect handling.

**Done when:** Docker builds from a clean checkout, starts against a migrated database, fails closed on missing secrets, and passes health checks.

### R1.4 Establish CI/CD quality gates

**Priority:** P0 · **Depends on:** R1.1, R1.2, R1.3

- Require lint, TypeScript check, unit/integration tests, production build, migration validation, and Docker image build for pull requests.
- Add a staging deployment and smoke test gate before production promotion.
- Publish test and coverage results; set sensible coverage thresholds for services/routes, with an explicit exception process.
- Block merges on failing checks and protect the production branch.

**Done when:** the pipeline can promote an immutable tested artifact to staging and production without manually rebuilding it.

## Phase 2 — Identity, authorization, and data protection

### R2.1 Complete account lifecycle security

**Priority:** P0 · **Depends on:** R1.4

- Add rate limits and bot/abuse controls to registration and sign-in endpoints.
- Normalise email addresses; add email verification, password-reset, session expiry/revocation, and login throttling/lockout controls.
- Validate password policy server-side, avoid account-enumeration leakage, and establish account deletion/deactivation flows.
- Use typed NextAuth session/JWT augmentation rather than unsafe casts.

**Done when:** automated tests prove rate limits, password reset, verification, expired/revoked sessions, and role propagation work correctly.

### R2.2 Centralise and prove authorization

**Priority:** P0 · **Depends on:** R2.1

- Create reusable server-side authorization helpers for student, instructor, admin, booking participant, and profile ownership checks.
- Make every API route explicitly authenticate and authorise itself; middleware is a secondary defence, not the source of truth.
- Fix empty-filter fall-throughs so a user without a profile receives an error/empty own result, never all records.
- Add route tests for unauthenticated, wrong-role, wrong-owner, missing-profile, and admin cases.

**Done when:** an authorization matrix exists and every route has positive and negative permission tests.

### R2.3 Protect PII and establish data governance

**Priority:** P0 · **Depends on:** R2.2

- Define public, participant-only, admin-only, and internal data transfer objects; never return raw Prisma entities by default.
- Remove public email addresses, private notes, payment identifiers, and unnecessarily granular availability from public responses.
- Add privacy notice, terms, cookie/analytics consent where applicable, retention/deletion rules, data-subject request process, and a processor/subprocessor register.
- Add audit logging for administrative actions, verification decisions, sensitive profile changes, refunds, and support access.

**Done when:** API contract tests prevent forbidden fields from appearing in each audience's response and legal/operational documents are ready for launch.

### R2.4 Add edge and application security controls

**Priority:** P0 · **Depends on:** R2.1, R2.3

- Configure HTTPS-only deployment, secure cookies, trusted host/origin configuration, CSP, HSTS, frame protection, MIME-sniffing protection, referrer policy, and permissions policy.
- Set request body limits, validated pagination/filter bounds, safe error responses, and server-side input schemas for every mutation/query parameter.
- Add automated dependency, secret, static-analysis, and dynamic staging security scans; triage all high/critical findings before release.

**Done when:** the staging security scan is clean of unresolved high/critical findings and response headers are verified by automated smoke tests.

## Phase 3 — Data model and marketplace activation rules

### R3.1 Evolve the schema for operational correctness

**Priority:** P0 · **Depends on:** R1.2, R2.3

- Add explicit instructor lifecycle fields (`verificationStatus`, activation/deactivation reason and timestamps) rather than overloading `adiVerified` as a soft delete.
- Add a booking-state/audit-event model and a payment-event/idempotency model; preserve Stripe event IDs and processing outcomes.
- Add database indexes and constraints for booking lookup/participant queries, message conversations, availability, payment intent uniqueness, and match cache access.
- Add data constraints for rates, durations, ratings, times, and valid availability intervals where PostgreSQL can enforce them.

**Done when:** schema migrations apply cleanly and integration tests demonstrate constraints protect against invalid or duplicate financial records.

### R3.2 Implement instructor activation and verification

**Priority:** P0 · **Depends on:** R3.1, R2.2

- Build an admin verification queue with evidence capture, approval/rejection reason, audit events, and instructor notification.
- Reconcile Stripe Connect account status (`charges_enabled`, `payouts_enabled`, requirements due) through webhooks and/or server retrieval.
- Enforce the activation predicate consistently in search, matching, profile visibility, booking, and dashboard guidance.
- Build instructor remediation states for rejected verification and incomplete Stripe onboarding.

**Done when:** an unverified/unpaid-capability instructor is impossible to discover or book, while active instructors can be surfaced and paid correctly.

### R3.3 Implement reliable availability and slot calculation

**Priority:** P0 · **Depends on:** R3.1, R3.2

- Define timezone policy (UK local time with DST-safe storage and rendering) and migrate availability/booking handling to it.
- Build a server-side slot generator from recurring and one-off availability, exceptions, buffer time, minimum lead time, and existing bookings.
- Validate intervals (`start < end`), prevent overlapping/corrupt slots, and add date-range query bounds.
- Replace the dashboard's grid payload with an API contract that creates/updates/deletes valid individual slots or a validated bulk command.

**Done when:** a test suite covers DST boundaries, overlaps, exceptions, buffers, and a slot disappears immediately when reserved.

## Phase 4 — Booking and payments: the launch-critical transaction flow

### R4.1 Define and enforce the booking state machine

**Priority:** P0 · **Depends on:** R3.3

- Specify permitted transitions, actors, preconditions, side effects, and user-visible wording for `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, and payment-failure/expiry states.
- Implement all transitions in a single domain service with atomic compare-and-set updates; delete direct status mutations from routes.
- Enforce booking dates in the future, valid duration increments, active instructor, generated available slot, no overlapping bookings, and one student/instructor participant relationship.
- Record immutable booking events and make all commands idempotent using a client idempotency key where appropriate.

**Done when:** concurrent-booking and invalid-transition integration tests prove that exactly one reservation succeeds and no terminal booking can be reopened accidentally.

### R4.2 Implement a correct Stripe payment flow

**Priority:** P0 · **Depends on:** R4.1, R3.2

- Create a reservation/booking before payment with server-derived price; create the PaymentIntent with booking ID/idempotency metadata and return only the client-safe payment data.
- Implement Stripe Elements/Payment Element confirmation in the browser; never mark confirmed from browser success alone.
- Confirm/cancel/expire bookings only from verified Stripe events and reconcile pending intents on a scheduled job.
- Handle SCA, declined/abandoned payments, retries, duplicate clicks, webhook retries/out-of-order events, and unknown PaymentIntent events.
- Store currency and amounts as integer minor units or rigorously constrained decimals; ensure the 15% fee calculation is server-owned and tested.

**Done when:** Stripe test-mode end-to-end tests cover success, 3DS, decline, retry, duplicate webhook, lost callback, and reconciliation.

### R4.3 Implement refunds, cancellation, and payout correctness

**Priority:** P0 · **Depends on:** R4.2, R0.1

- Implement the approved cancellation policy, including actor, cutoff, refund amount, partial/no-refund handling if applicable, and idempotent Stripe refund creation.
- Separate payment/refund/payout records from booking status and reconcile them from Stripe events.
- Confirm the selected Connect charge model with Stripe; handle transfers, reversals, refunds, negative balances, and payout reporting consistently.
- Provide staff refund tooling with role checks, reason capture, audit events, and customer/instructor communication.

**Done when:** financial ledger/reconciliation tests show booking amount, platform fee, instructor amount, refund, and Stripe balance agree for every supported path.

### R4.4 Build the production booking UI

**Priority:** P0 · **Depends on:** R4.2, R3.3

- Replace fixed dates, slots, prices, timeout simulation, and fake confirmation with live instructor/slot data and the Payment Element.
- Use the route instructor ID; show only bookable active instructors and explain unavailable/payment-failure states.
- Make confirmation pages derive data from the persisted booking and webhook-confirmed status.
- Add accessible validation, retry/cancellation behaviour, and non-JavaScript/error recovery paths where practical.

**Done when:** a logged-in student can complete a real Stripe test-mode booking from the UI and sees only persisted server data after refresh.

## Phase 5 — Complete the remaining MVP product flows

### R5.1 Replace all mock/stub UI with server-backed flows

**Priority:** P0 · **Depends on:** R2.2, R3.2, R4.4

- Replace hard-coded instructor profile, match, booking, dashboard, earnings, messaging, and progress data.
- Remove fake success states and repair or remove every call to a route that does not exist (`/api/reviews`, `/api/instructor/profile`, `/api/instructor/availability`).
- Establish typed API client/contracts and consistent loading, empty, error, and retry states.
- Ensure dashboards show the authenticated user's data only, not sample names or dates.

**Done when:** repository searches find no launch-flow mocks/fixed historical dates/simulated responses and browser E2E tests use only live API contracts.

### R5.2 Ship discovery, matching, and public profiles

**Priority:** P0 · **Depends on:** R3.2, R5.1

- Make public instructor profile and search pages fetch real, privacy-filtered active-instructor data.
- Connect matching UI and filters to the matching API; specify filter semantics and ensure client filters do not misrepresent score ordering.
- Test matching scores with production-style datasets and explain key match factors without exposing sensitive preferences.
- Add empty-state and availability-aware booking calls to action.

**Done when:** a new student can complete a profile, see only eligible real matches, inspect a real profile, and start a booking.

### R5.3 Complete instructor profile, availability, and booking management

**Priority:** P0 · **Depends on:** R3.2, R3.3, R4.1, R5.1

- Load/save profile data using canonical enum mappings and valid update endpoints; include image-upload security if profile photos remain in MVP.
- Connect availability UI to the validated slot API and display current persisted slots.
- Connect booking list/actions to the state machine; surface payment state, cancellation policy, and action availability accurately.
- Make earnings read from reconciled financial records; do not publish synthetic balances/payout history.

**Done when:** an active instructor can manage their own profile/slots and accurately see/action only their booking and financial data.

### R5.4 Complete reviews, progress, messaging, and continuity

**Priority:** P1 · **Depends on:** R4.1, R5.1

- Wire review creation to `POST /api/bookings/[id]/review`; show result/error and preserve the one-review-per-completed-booking rule.
- Restrict message creation/read access to approved booking relationships; validate optional `bookingId` belongs to those two users and add pagination.
- Wire progress UI to real entries and restrict instructor access to the appropriate student/booking relationship.
- Replace console-log notifications and continuity suggestions with durable outbox jobs and deliverable email/in-app notifications.

**Done when:** all four flows work against real data, have permission tests, and failed notification delivery can be retried without blocking the main transaction.

## Phase 6 — Observability, support, and resilience

### R6.1 Add production observability

**Priority:** P0 · **Depends on:** R1.3, R4.2

- Add structured logs with request/correlation IDs and PII redaction.
- Add error tracking with source maps, performance monitoring, uptime checks, and alerts for availability, failed jobs, webhook failures, failed payments, and elevated error rates.
- Instrument product events/funnel metrics with consent-aware analytics.
- Build a minimal internal operational view or documented query set for payment/booking reconciliation and support lookup.

**Done when:** a staged synthetic booking can be traced across UI, API, database, Stripe event, and notification; test alerts reach the responsible owner.

### R6.2 Implement asynchronous work and resilience patterns

**Priority:** P0 · **Depends on:** R4.2, R5.4, R6.1

- Add a durable job/outbox system for email, continuity matching, Stripe reconciliation, and retries.
- Define retry/backoff/dead-letter rules, idempotency keys, and manual replay support.
- Set database connection/pool limits and timeouts appropriate to the deployment target.
- Load-test browsing, matching, simultaneous booking, webhook bursts, and job retries; remediate bottlenecks.

**Done when:** induced provider/database failures do not lose financial or customer-facing events, and capacity results meet the agreed launch traffic target.

### R6.3 Prepare customer and financial support

**Priority:** P0 · **Depends on:** R4.3, R6.1

- Publish help content for booking, payment, cancellation, verification, data requests, and safety concerns.
- Create support playbooks for failed payments, double-booking reports, instructor cancellation, refunds, fraud, data deletion, Stripe outages, and security incidents.
- Set up support intake, response ownership, status page/incident communications, and a restricted support-admin workflow.

**Done when:** a dry run completes each P0 support scenario within its stated service target and all access is audited.

## Phase 7 — Test, accessibility, and release assurance

### R7.1 Build the automated test pyramid

**Priority:** P0 · **Depends on:** Phases 1–6 implementation tasks

- Expand unit tests for validators, matching, money/rounding, slot generation, booking state machine, permissions, and notification jobs.
- Add integration tests using an ephemeral PostgreSQL database and Stripe test fixtures/webhook signatures.
- Add browser E2E tests for student and instructor onboarding, activation, search/matching, booking/payment, cancellation/refund, review, messaging, and progress.
- Add regression fixtures for authorization and financial incidents discovered during development.

**Done when:** CI runs the full suite reliably and every launch-critical acceptance criterion has automated coverage or an explicitly recorded manual verification.

### R7.2 Validate accessibility and user experience

**Priority:** P0 · **Depends on:** R5.1–R5.4

- Audit the complete MVP against WCAG 2.2 AA: keyboard navigation, focus management, semantic forms, labels/errors, contrast, responsive behaviour, and screen-reader flows.
- Test mobile/tablet/desktop browsers and slow/unreliable connections.
- Conduct moderated usability checks with representative student and instructor users; resolve blockers in onboarding and booking.
- Ensure all legal/policy copy and cancellation/payment disclosures are visible at the decision point.

**Done when:** no critical accessibility defects remain and representative users can complete the primary flows without facilitator intervention.

### R7.3 Execute security and production readiness review

**Priority:** P0 · **Depends on:** R2.4, R4.3, R6.2, R7.1

- Run a documented security review/penetration test targeting authentication, authorization, PII, Stripe webhooks, admin functions, and abuse controls.
- Review dependencies and licenses; resolve all high/critical vulnerabilities or record approved risk acceptance with expiry.
- Perform backup restore, rollback, incident, payment-reconciliation, and webhook-replay drills in staging.
- Review GDPR/UK privacy, Stripe, tax/accounting, and marketplace obligations with qualified counsel/accounting advisers as required.

**Done when:** all critical findings are fixed, remaining risks have an owner/expiry, and drill evidence is attached to the release record.

## Phase 8 — Controlled launch

### R8.1 Run a private beta

**Priority:** P0 · **Depends on:** all Phase 7 tasks

- Invite a small, verified supply-first cohort in the agreed launch geography.
- Use real production configuration with reduced payment limits/support monitoring as appropriate.
- Monitor activation, match quality, booking conversion, payment errors, cancellations, support tickets, and reconciliation daily.
- Fix launch-blocking defects before increasing cohort size; avoid feature expansion during beta.

**Done when:** the defined beta success thresholds hold for the agreed period, reconciliation is clean, and no unresolved P0/P1 safety, privacy, or payment issue exists.

### R8.2 Conduct launch go/no-go and release

**Priority:** P0 · **Depends on:** R8.1

- Hold a formal go/no-go review with engineering, operations, support, and business owners.
- Verify the checklist below, approve a rollback plan, and confirm monitoring/on-call coverage.
- Gradually open registration/marketing within the initial geography; monitor defined launch metrics and rollback triggers.

**Done when:** the release owner records go-live approval, the production release is tagged, and post-launch monitoring is active.

## Launch go/no-go checklist

- [ ] Clean commit passes deterministic CI: lint, type check, unit/integration/E2E suite, production build, migrations, and Docker image build.
- [ ] Production database migration, encrypted backup, and restore drill have succeeded.
- [ ] Production secrets, Stripe live mode, webhook signing, domains, HTTPS, security headers, and environment validation are verified.
- [ ] Active-instructor policy is enforced in every search, match, profile, availability, and booking path.
- [ ] Real payment, SCA, webhook, refund, cancellation, payout/reconciliation, and double-booking scenarios have passed end-to-end in Stripe test mode and staging.
- [ ] No public/unauthorised endpoint exposes PII, payments, bookings, messages, or profile data outside its audience.
- [ ] No critical/high unresolved security issue exists; rate limits, audit logs, error monitoring, and alerts are live.
- [ ] All customer-facing MVP pages are live-data backed; no mock data, placeholder earnings, fake confirmations, or dead API calls remain.
- [ ] Accessibility, responsive UX, performance, support, incident, and rollback checks have passed.
- [ ] Legal/privacy/policy documents, support channels, staffing, and launch communications are ready.
- [ ] Private beta metrics meet the agreed thresholds and daily financial reconciliation is clean.

## Recommended execution milestones

| Milestone | Completion condition |
|---|---|
| **M1: Safe foundation** | Phases 0–2 complete; repeatable build/deploy and secure APIs. |
| **M2: Bookable marketplace** | Phases 3–4 complete; verified, payable instructors and end-to-end Stripe test bookings. |
| **M3: MVP product complete** | Phase 5 complete; all promised MVP screens use real data. |
| **M4: Operable release candidate** | Phases 6–7 complete; monitored, tested, supportable, and release-approved. |
| **M5: Controlled launch** | Phase 8 complete; beta evidence supports phased public launch. |
