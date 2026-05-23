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
- Review all deliverables and ensure all requirements are met.
