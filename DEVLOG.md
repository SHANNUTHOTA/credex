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