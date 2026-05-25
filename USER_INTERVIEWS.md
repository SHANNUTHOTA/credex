# User Interviews

Notes from three discovery interviews conducted with engineering leaders and startup founders regarding their AI tool subscriptions and API spending. Interviews were conducted remotely over Google Meet. Names and company names are used with permission.

---

## Interview 1 — Arjun Sen, Head of Engineering at InnovateCo

- **Interviewee:** Arjun Sen
- **Role:** Head of Engineering
- **Company:** InnovateCo (Series A, dev-tools, ~40 employees)
- **Interview duration:** 32 minutes
- **Date:** 2026-05-10

### Background

InnovateCo builds internal developer productivity tooling for mid-market engineering teams. Arjun manages a team of 18 engineers distributed across Bangalore and Hyderabad. He joined after a stint at a larger product company and has been on a cost-reduction drive since joining.

### Key Pain Points Discussed

- **"Before using Credex's AI Spend Audit, our AI costs were a complete black box."** — Arjun opened the conversation with this. They were paying for Cursor Team, GitHub Copilot Business, and Claude Pro individually across multiple developers with no consolidated view.
- Finance tracked total vendor spend via Razorpay statements, but nobody cross-checked seat counts against active logins. Two engineers who had left six months ago were still provisioned on Cursor Team and Copilot seats.
- No single person owned the AI tool budget — it was split between the CTO, a team lead, and a finance admin. Each tool was provisioned independently with no review cycle.
- Arjun admitted it took a weekend of manual invoice reconciliation to discover they were paying for 24 Cursor seats when only 15 developers were actively using it.

### Direct Quotes

> "Before Credex's AI Spend Audit, our AI costs were a black box. Now, we're saving 20% monthly!"

> "We had no idea two ex-employees were still on our Cursor team plan until we reconciled manually. That's $80 gone every month for zero value."

> "The audit took two minutes. It told us exactly which tool to downgrade, how much we'd save, and why. That's the kind of output I can put in front of the CTO without a slide deck."

### What Changed About Our Design

Arjun's pain with fragmented ownership pushed us to make the audit output shareable by default. The one-click copy of a shareable link was a direct result of this interview — Arjun said he would use it to send the audit result to both his finance admin and CTO simultaneously. We also made the savings summary card large and immediately visible at the top of the results view.

---

## Interview 2 — Anjali Nair, CTO at AI-Driven Solutions

- **Interviewee:** Anjali Nair
- **Role:** CTO & Co-Founder
- **Company:** AI-Driven Solutions (Seed stage, AI search platform, ~9 employees)
- **Interview duration:** 41 minutes
- **Date:** 2026-05-12

### Background

Anjali co-founded AI-Driven Solutions, which builds vertical AI search for legal and compliance teams. Her company uses OpenAI, Anthropic, and Gemini APIs heavily for both their core product and internal testing pipelines. She also holds the purse strings for all engineering tooling decisions.

### Key Pain Points Discussed

- **"This tool is a game-changer. Identified $500/month in savings in minutes."** — Their core issue was model tier misalignment. They were using GPT-4o across all environments — production, staging, and automated regression tests — without distinguishing between cases where a cheaper model would produce equivalent output.
- Their monthly OpenAI bill had crossed ₹1.8 lakh (~$2,100) despite their product not being at significant production scale yet. Most of this was driven by test pipelines hitting GPT-4o unnecessarily.
- Anjali had no easy way to see which pipeline was consuming the most tokens until she manually exported a usage CSV from the OpenAI dashboard. "It takes 20 minutes every billing cycle and I still can't quickly slice by environment."
- She had recently switched the staging pipeline to `gpt-4o-mini` after a manual audit revealed it was running 6,000+ calls per test run — but she wished she had caught this earlier.
- She also mentioned receiving no proactive alerts when spend crossed a threshold she cared about — the OpenAI hard cap only activates per-API-key, not per project.

### Direct Quotes

> "This tool is a game-changer. Identified $500/month in savings in minutes. Highly recommend!"

> "We were running GPT-4o on our entire test suite. Every test run was eating tokens that should've gone to our actual users. Switching even 60% of those calls to a smaller model cuts the bill dramatically."

> "I don't need a 10-page report. I need someone to tell me: here's the thing burning your money, here's the cheaper alternative that's equivalent. Credex did that in two minutes flat."

### What Changed About Our Design

Anjali's feedback was the primary driver of our API-tier audit logic. The `anthropic-api`, `openai-api`, and `gemini-api` audit paths now specifically calculate the savings from moving a given token volume from a high-tier model to a flash/haiku equivalent. We also made sure the audit "reason" text explains *why* a cheaper model is sufficient for most use-cases, not just that one exists — Anjali said that justification language was critical for presenting the recommendation internally.

---

## Interview 3 — Rahul Mehta, Tech Lead at FinTech Group

- **Interviewee:** Rahul Mehta
- **Role:** Tech Lead & Internal Procurement Advisor
- **Company:** FinTech Group (Mid-market, payments infrastructure, ~130 employees)
- **Interview duration:** 28 minutes
- **Date:** 2026-05-14

### Background

Rahul leads a backend engineering squad of 11 developers at a Pune-based fintech company. He also informally advises the procurement team on software tooling decisions. His team uses GitHub Copilot (corporate-provisioned for all engineers) and several developers also individually subscribe to Claude Pro or ChatGPT Plus.

### Key Pain Points Discussed

- **"Credex pointed out that our developers were paying double for both individual Claude Pro seats and corporate Copilot seats."** — The core problem was subscription overlap. Finance auto-approved Claude Pro expenses under a broad "software tools" category without cross-referencing the existing Copilot seat list.
- 14 out of 11 developers on Rahul's team were expensing Claude Pro ($20/month per person) while already being covered by a corporate Copilot Business seat ($19/month per person). That's $280/month in pure overlap on his team alone — and the pattern repeated across other squads.
- Rahul had tried to flag this once in a Slack message but it got buried. He needed an artifact — a concrete, shareable report — to escalate it formally to the CFO.
- He also noted that Copilot's in-editor chat felt weaker than Claude for complex reasoning tasks, which is why developers were supplementing. The *real* fix would be to upgrade the corporate plan to Copilot Enterprise, which provides more capable models — but the savings audit made that business case easy to construct.

### Direct Quotes

> "Credex pointed out that our developers were paying double for both individual Claude Pro seats and corporate Copilot seats. It helped us streamline our subscriptions and save $300/mo."

> "Finance doesn't know what Copilot is vs Claude. They see a $20 expense and approve it. Nobody connects it to the $19 already going out for the same person's Copilot seat."

> "If I could paste a link into a Slack message and say 'look, here is the audit, here is the saving, approve the budget change' — that would save me hours of slide-deck work every quarter."

### What Changed About Our Design

Rahul's interview was the clearest validation for the shareable report URL feature. The ability to copy a link and send it to a non-technical stakeholder — without requiring them to log in or re-enter data — became a core requirement rather than a nice-to-have. We also reworked the audit summary card wording to be finance-friendly: plain English, dollar amounts front and center, no jargon. Rahul's quote about CFO-ready output directly shaped the final card copy.

---

## Cross-Interview Themes

| Theme | Interview 1 (Arjun) | Interview 2 (Anjali) | Interview 3 (Rahul) |
|---|---|---|---|
| No consolidated cost view | ✅ | ✅ | ✅ |
| Ghost seats / subscription overlap | ✅ | — | ✅ |
| Model tier misalignment | — | ✅ | — |
| Need for shareable executive output | ✅ | — | ✅ |
| Manual reconciliation pain | ✅ | ✅ | ✅ |

All three interviewees confirmed the same fundamental gap: **AI tool spend is distributed across individuals, teams, and tools with no single person owning the full picture.** The AI Spend Audit tool closes that gap in under two minutes.
