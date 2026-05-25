# AI Spend Audit

A free tool to help you audit your AI spend and identify potential savings.

## Features

- **Spend Input Form:** Allows users to input their AI tools, monthly spend, and number of seats/tokens.
- **Audit Engine:** Evaluates spending based on predefined pricing data and recommends cheaper alternatives or optimization strategies.
- **Audit Results Page:** Displays a detailed breakdown of current spend, recommended actions, and potential savings.
- **AI-Generated Personalized Summary:** Provides a high-level summary of the audit findings (placeholder implemented).
- **Lead Capture:** Captures user email and optional company details for high-savings cases.
- **Shareable Result URL:** Generates a unique URL for each audit report, allowing easy sharing.
- **Transactional Email:** Sends an email with the audit report to the user after lead capture.
- **Abuse Protection:** Implemented a simple honeypot to prevent bot submissions.
- **Open Graph Tags:** Ensures proper previews when sharing audit reports on social media.

## Quick Start

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SHANNUTHOTA/credex.git
    cd credex
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Supabase and Resend API keys, and your base URL:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    RESEND_API_KEY=YOUR_RESEND_API_KEY
    NEXT_PUBLIC_BASE_URL=https://shannuthota.github.io/credex
    ```
4.  **Run locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Decisions

1. Trade-off: Static export to GitHub Pages vs Vercel serverless API
    - Chosen: GitHub Pages (static export) to satisfy user request and simplify deployment.
    - Why: Fast, free hosting with predictable asset delivery.
    - Cost: Limits server-side API functionality on Pages; requires external backend for Supabase/Resend in production.

2. Trade-off: Client-side audit engine vs server-side
    - Chosen: Client-first audit calculation with optional server persistence.
    - Why: Immediate UX (no login), simpler static deployment, and easier sharing via unique URLs.
    - Cost: Audit logic is visible in client bundle; sensitive operations (lead capture) still use Supabase server.

3. Trade-off: Use of LLM for summaries vs deterministic templated summaries
    - Chosen: Use LLM for a personalized paragraph with a robust templated fallback.
    - Why: LLM adds polish and conversion lift; fallback ensures reliability.
    - Cost: LLM adds latency and cost; prompts and fallbacks documented in `PROMPTS.md`.

4. Trade-off: Minimal UI polish vs time for perfect design
    - Chosen: Prioritize clarity and functionality over heavy design work given the deadline.
    - Why: The audit results page is the key viral asset; clarity and defensible logic are higher priority.
    - Cost: Visual polish can be iterated post-submission.

5. Trade-off: Build-time client initialization vs runtime lazy init
    - Chosen: Lazy-initialize third-party clients (Resend) inside API handlers.
    - Why: Prevents build-time failures in CI and on static export builds when secrets are absent.
    - Cost: Slightly more code complexity in API handlers.

### Screenshots

These screenshots were captured from the current build and show the landing page, an in-progress audit, and the completed audit result.

- ![Landing page](public/screenshots/screenshot-1.png)
- ![Filled form](public/screenshots/screenshot-2.png)
- ![Audit result](public/screenshots/screenshot-3.png)

## Deployed URL

The application is deployed on GitHub Pages and can be accessed at:
[https://shannuthota.github.io/credex](https://shannuthota.github.io/credex)
