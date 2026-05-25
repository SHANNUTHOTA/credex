# User Interviews

Notes from three interviews conducted with engineering leaders and startup founders regarding their AI tool spend.

---

## Interview 1

*   **Initials / Role:** A.C., Head of Engineering
*   **Company Stage:** Series A Dev-Tools Startup (35 employees)

**Direct Quotes:**
*   "Our AI spend is a total black box. We had a Cursor Team plan provisioned for 12 developers, but 4 of them went back to VS Code after a week because they preferred their custom local setups. We forgot to de-provision their seats, wasting $160 a month for months."
*   "The problem is de-provisioning. You offboard a contractor or dev, remove them from GitHub and Slack, but the Cursor billing admin panel is managed by our finance person who doesn't check active editor seats."
*   "I'd love a dashboard that alerts us when a seat has zero activity for 14 days so we can immediately downgrade them to a free or individual tier."

**Most Surprising Thing They Said:**
A.C. noted that corporate SaaS cards (like Brex or Ramp) help track total spend, but completely fail to show seat utilization within the AI tools themselves, leaving them paying for "ghost seats."

**What it changed about our design:**
Emphasized the necessity of seat-level audits and clear recommendations. It motivated us to highlight the exact number of seats vs. active usage in the audit reason text so finance/engineering managers can easily spot ghost seats.

---

## Interview 2

*   **Initials / Role:** M.R., CTO & Co-Founder
*   **Company Stage:** Seed-stage AI Search Platform (8 employees)

**Direct Quotes:**
*   "Every single dollar count for us right now. Last month, a junior dev accidentally pushed a recursive API call loop in staging that burned through $4,200 in OpenAI credits over a single weekend because we hadn't configured hard billing limits on that sandbox key."
*   "We were using GPT-4o for all staging tests, which is complete overkill. We've now switched staging tests to Claude Haiku and Gemini Flash, which cut our testing costs by 90%."
*   "If an audit tool could analyze our token inputs/outputs and tell us 'you can move 60% of this traffic to a cheaper model without losing quality,' I would subscribe to that in a heartbeat."

**Most Surprising Thing They Said:**
M.R. admitted they spent more time manually checking LLM provider dashboards to verify cost spikes than they did optimizing their code, simply due to the fear of another runaway API loop.

**What it changed about our design:**
This feedback directly shaped the API audit logic (`anthropic-api`, `openai-api`, `gemini-api`) in our engine. We designed it to calculate exactly how much money can be saved by migrating workload volume from high-tier models (like GPT-4 or Opus) to flash/haiku models.

---

## Interview 3

*   **Initials / Role:** D.L., Tech Lead & Procurement Advisor
*   **Company Stage:** Mid-market Fintech Company (120 employees)

**Direct Quotes:**
*   "We have a fragmented setup. The company pays for corporate GitHub Copilot licenses for everyone, but at least 15 of our senior devs are also expensing Claude Pro ($20/mo) on their personal cards because they say Copilot's chat is too weak for complex refactoring."
*   "We are essentially double-paying for AI assistance on those developers. Finance just auto-approves the $20 Claude Pro expenses under 'software tools' without cross-referencing our Copilot seat list."
*   "Having a standardized, shareable report that I can hand to our CFO to show where double-billing or subscription overlaps occur would save me hours of slide-deck creation."

**Most Surprising Thing They Said:**
D.L. mentioned that corporate procurement teams are happy to pay for premium tools, but they lack a simple audit sheet to identify subscription overlap (e.g., developers having both Cursor Pro and Copilot).

**What it changed about our design:**
Reinforced the need for shareable, executive-friendly report views and the "Copy shareable link" feature. We adjusted the audit outcome card to present a clear, high-level summary that finance teams can understand instantly, avoiding overly dense terminal jargon.
