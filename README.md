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

## Screenshots

_Coming soon..._

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

_Coming soon..._

## Deployed URL

The application is deployed on GitHub Pages and can be accessed at:
[https://shannuthota.github.io/credex](https://shannuthota.github.io/credex)
