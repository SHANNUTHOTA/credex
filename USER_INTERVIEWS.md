# User Interviews (Simulated)

Notes from three simulated conversations with potential users.

---

## Interview 1

*   **Name:** Alex Chen
*   **Role:** Head of Engineering
*   **Company Stage:** Series A SaaS Startup (50 employees)

**Direct Quotes:**
*   "Our AI spend is a black box. It just keeps going up, and I don't really know why or if we're getting value."
*   "I've tried to look at the bills, but it's just a bunch of numbers. I need something that tells me, 'Hey, you're paying too much for X, switch to Y.'"
*   "We use GitHub Copilot, some OpenAI APIs, and a bit of Claude. It's hard to compare them directly."
*   "I'd love a quick way to see if we're on the right plan. We're growing fast, so our needs change."

**Most Surprising Thing They Said:**
Alex mentioned that he often just "pays the bill" because the complexity of understanding AI spend is too high, and his time is better spent on product development. This highlights the significant pain point and the need for a simple, actionable audit.

**What it changed about your design:**
Reinforced the need for extreme simplicity and clear, actionable recommendations. The "reason" for savings is crucial, not just the number. Also, emphasized the importance of supporting multiple AI tools for comparison.

---

## Interview 2

*   **Name:** Maria Rodriguez
*   **Role:** CTO
*   **Company Stage:** Seed-funded AI-first Startup (15 employees)

**Direct Quotes:**
*   "Every dollar counts for us. We're constantly looking for ways to optimize, especially with our LLM usage."
*   "We're using OpenAI's GPT-4 Turbo for most things, but I wonder if GPT-3.5 Turbo could handle some of our less critical tasks for cheaper."
*   "I'm worried we're paying retail for our API usage. Are there better deals out there?"
*   "A quick audit that tells me 'you could save X by doing Y' would be incredibly valuable. I don't have time for deep dives."

**Most Surprising Thing They Said:**
Maria expressed concern about "paying retail" for API usage, indicating an awareness of potential discounts or alternative purchasing methods (like through Credex). This validates the core value proposition of Credex's offering.

**What it changed about your design:**
Highlighted the importance of API usage optimization (token-based pricing) and the need to suggest switching between different models within the same provider (e.g., GPT-4 Turbo to GPT-3.5 Turbo). Also, reinforced the idea of Credex as a solution for "better deals."

---

## Interview 3

*   **Name:** David Lee
*   **Role:** Senior Software Engineer (involved in procurement decisions)
*   **Company Stage:** Mid-size Tech Company (200 employees)

**Direct Quotes:**
*   "We have a few teams using Cursor, some using GitHub Copilot. It's a bit fragmented."
*   "I'm often asked to justify our AI tool subscriptions. A report that shows potential savings would be a strong argument."
*   "The biggest challenge is getting a clear picture across different tools and different teams."
*   "If I could easily share a report with our finance team, that would be a huge win."

**Most Surprising Thing They Said:**
David emphasized the internal justification aspect and the need for a shareable report for finance teams. This underscores the importance of the shareable URL feature and the defensibility of the audit logic.

**What it changed about your design:**
Strengthened the focus on the shareable URL and ensuring the audit results are clear, concise, and easily understandable by non-technical stakeholders (like finance). The "reason" field in the audit result became even more critical.
