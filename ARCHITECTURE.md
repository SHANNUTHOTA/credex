# Architecture

## System Diagram

```mermaid
graph TD
    A[User] --> B(Frontend: Next.js App)
    B --> C{API Routes}
    C --> D[Supabase: PostgreSQL DB]
    C --> E[Resend: Email Service]
    C --> F[LLM: Gemini API (for summary)]

    D --> G[Shareable Audit Page]
    B --> G
```

## Data Flow

1.  **User Input:** The user interacts with the Next.js frontend, providing details about their AI tool usage (tool, monthly spend, seats/tokens).
2.  **Audit Execution:** The frontend calls the `runAudit` function (client-side) to calculate potential savings and recommended actions.
3.  **Save Audit Result:** The frontend sends the audit result to the `/api/audit` Next.js API route.
4.  **Database Storage:** The `/api/audit` route saves the audit result to the `audit_results` table in Supabase. A unique `id` is generated for the audit.
5.  **Shareable URL Generation:** The frontend receives the `id` and constructs a shareable URL (e.g., `/audit/[id]`).
6.  **Lead Capture (Optional):** If the user opts to capture their lead, they fill out a form (email, company, role, team size).
7.  **Save Lead:** The frontend sends the lead data (including the `audit_result_id`) to the `/api/lead` Next.js API route.
8.  **Database Storage:** The `/api/lead` route saves the lead information to the `leads` table in Supabase.
9.  **Transactional Email:** After saving the lead, the frontend calls the `/api/send-email` Next.js API route to send a confirmation email with the audit report and shareable URL using Resend.
10. **View Shareable Report:** When a user accesses the shareable URL (`/audit/[id]`), the `src/app/audit/[id]/page.tsx` fetches the audit details from Supabase using the `id` and displays the report, including the AI-generated summary.

## Stack

-   **Frontend Framework:** Next.js (with TypeScript)
-   **Styling:** Tailwind CSS + shadcn/ui
-   **Backend:** Next.js API routes (for data persistence and email sending)
-   **Database:** Supabase (PostgreSQL for `audit_results` and `leads` tables)
-   **Email Service:** Resend (for transactional emails)
-   **LLM for Summary:** Gemini API (placeholder implemented, would be integrated via API call)
-   **Deployment:** GitHub Pages

## Scaling

-   **Frontend:** Next.js with static export is highly scalable, as it serves pre-built HTML, CSS, and JavaScript files. GitHub Pages can handle a large volume of traffic efficiently.
-   **Backend (API Routes):** Next.js API routes are serverless functions, which scale automatically based on demand.
-   **Database (Supabase):** Supabase uses PostgreSQL, which is a robust and scalable relational database. Supabase handles the infrastructure scaling.
-   **Email Service (Resend):** Resend is a scalable email API designed for high-volume transactional emails.
-   **LLM (Gemini API):** The Gemini API is a managed service by Google, designed for high availability and scalability.

To handle 10k audits/day, the current architecture is well-suited. The serverless nature of Next.js API routes and the managed services (Supabase, Resend, Gemini API) provide inherent scalability. The static frontend served by GitHub Pages would also handle traffic efficiently. The main considerations would be optimizing database queries and ensuring efficient LLM calls to manage costs and latency.
