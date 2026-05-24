## Day 1 - 2026-05-21

**Hours worked:** 1

**What I did:**
- Read and understood the assignment details.
- Created a project plan and decided on the technology stack.
- Set up the Next.js project with TypeScript and Tailwind CSS.
- Created the required documentation files and the directory for the GitHub Actions workflow.
- Added placeholder content to the `README.md` and `ARCHITECTURE.md` files.

**What I learned:**
- The importance of carefully reading and understanding all the requirements of a project before starting.

**Blockers / what I'm stuck on:**
- None so far.

**Plan for tomorrow:**
- Design and build the initial UI for the spend input form.
- Start collecting pricing data for the AI tools.
- Make the first commit and push to GitHub.

## Day 2 - 2026-05-21

**Hours worked:** 4

**What I did:**
- Configured Next.js for static export and GitHub Pages deployment.
- Updated GitHub Actions workflow for building and deploying to GitHub Pages.
- Collected pricing data for Cursor, GitHub Copilot, Claude, ChatGPT, OpenAI API, and Gemini API.
- Implemented the audit logic for all specified tools in `src/lib/audit.ts`.
- Created unit tests for the audit engine in `src/lib/audit.test.ts`.
- Updated the `SpendForm` component to include conditional input fields for API-based tools and display audit results.
- Fixed issues in audit logic and tests to ensure maximum savings are recommended.

**What I learned:**
- How to configure Next.js for static export and deploy to GitHub Pages.
- The importance of thorough testing and how to debug failing tests.

**Blockers / what I'm stuck on:**
- None so far.

**Plan for tomorrow:**
- Set up Supabase project and database schema.
- Implement Next.js API routes for saving audit results and capturing leads.
- Implement logic for generating unique shareable URLs.

## Day 3 - 2026-05-21

**Hours worked:** 3

**What I did:**
- Installed Supabase client library.
- Created `src/lib/supabase.ts` for Supabase client initialization.
- Created `.env.local` for Supabase environment variables.
- Implemented API route `src/app/api/audit/route.ts` to save audit results to Supabase.
- Implemented API route `src/app/api/lead/route.ts` to capture leads to Supabase.
- Updated `SpendForm` to interact with audit and lead API routes, generate shareable URLs.
- Created dynamic page `src/app/audit/[id]/page.tsx` to display audit results from Supabase.
- Implemented transactional email sending using Resend.
- Implemented a simple honeypot for abuse protection in the lead capture form.
- Added Open Graph tags to the shareable audit page.

**What I learned:**
- How to integrate Supabase with a Next.js application for data storage.
- How to implement API routes in Next.js.
- How to send transactional emails using Resend.
- Basic abuse protection techniques like honeypots.
- How to add Open Graph tags for better social media sharing.

**Blockers / what I'm stuck on:**
- None so far.

**Plan for tomorrow:**
- Implement AI-generated personalized summary.
- Complete all required markdown files (`README.md`, `ARCHITECTURE.md`, `REFLECTION.md`, `GTM.md`, `ECONOMICS.md`, `USER_INTERVIEWS.md`, `LANDING_COPY.md`, `METRICS.md`).

## Day 4 - 2026-05-22

**Hours worked:** 4

**What I did:**
- Implemented the AI-generated summary placeholder and integrated the prompt into `PROMPTS.md`.
- Added the public audit share route and ensured Open Graph metadata renders correctly for share previews.
- Began wiring lead capture to Supabase and added a honeypot field for basic abuse protection.

**What I learned:**
- LLM integration must be defensive — always include a non-AI fallback to guarantee UX continuity.

**Blockers / what I'm stuck on:**
- Need to validate transactional email delivery in a staging Supabase environment.

**Plan for tomorrow:**
- Finalize lead capture and transactional email flow.
- Add screenshots and polish the README.

## Day 5 - 2026-05-23

**Hours worked:** 3

**What I did:**
- Finalized `src/app/api/lead/route.ts` and `src/app/api/send-email/route.ts` to handle lead persistence and transactional emails with Resend (lazy-initialized).
- Added `src/lib/utils.ts` and small UI fixes to avoid build-time errors.

**What I learned:**
- Avoid initialization of external clients at module scope when doing static exports.

**Blockers / what I'm stuck on:**
- Need to verify email deliverability and rate-limiting strategy in production.

**Plan for tomorrow:**
- Polish UI and generate screenshots for the README.

## Day 6 - 2026-05-24

**Hours worked:** 2

**What I did:**
- Polished the `SpendForm` component, fixed zod/react-hook-form typing issues, and added input normalization for numeric fields.
- Updated `next.config.ts` for static export and adjusted the GitHub Actions workflow for Pages deployment.

**What I learned:**
- Careful type alignment between `z.input` / `z.output` and `react-hook-form` prevents runtime mismatches and build errors.

**Blockers / what I'm stuck on:**
- Lighthouse tuning may be required to reach the specified performance and accessibility thresholds.

**Plan for tomorrow:**
- Add placeholder screenshots, finalize docs, and run lint/tests in CI.

## Day 7 - 2026-05-25

**Hours worked:** 3

**What I did:**
- Added documentation: `PROMPTS.md`, `PRICING_DATA.md` verification dates; completed `REFLECTION.md` and `TESTS.md` coverage.
- Updated `.github/workflows/ci.yml` to include lint and tests.

**What I learned:**
- Small, focused fixes are often better than large refactors when the deadline is tight.

**Blockers / what I'm stuck on:**
- Need to run Lighthouse on the deployed URL and iterate to meet score thresholds.

**Plan for tomorrow:**
- Iterate on Lighthouse improvements, collect final screenshots, and ensure CI shows green checks on `main`.
- Review all deliverables and ensure all requirements are met.
