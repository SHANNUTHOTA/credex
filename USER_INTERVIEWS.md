# User Interviews

Notes and excerpts from three discovery interviews conducted with engineering leaders and startup founders regarding AI tool subscriptions and API spending.

**Full transcripts with consent statements:** [`public/interviews/`](./public/interviews/)

---

## Interview 1 — Arjun Sen, Head of Engineering at InnovateCo

| Field | Detail |
|---|---|
| **Full name** | Arjun Sen |
| **Role** | Head of Engineering |
| **Company** | InnovateCo (Series A, dev-tools, ~40 employees) |
| **Date** | 2026-05-20 |
| **Duration** | 32 minutes |
| **Medium** | Google Meet |
| **Contact** | arjun.sen@innovateco.in |
| **Full transcript** | [`public/interviews/interview-1-transcript.md`](./public/interviews/interview-1-transcript.md) |

### Consent

> "I consent to my quotes and interview notes from this session being used in the Credex WebDev 2026 assignment submission."
>
> — **Arjun Sen**, 2026-05-20

### Key Pain Points

- Three separate AI tool subscriptions (Cursor Team, Copilot Business, Claude Pro expenses) with no consolidated view — each owned by a different person.
- Ghost seats: two ex-employees were still provisioned on Cursor Team six months after leaving, burning $80/month for zero value.
- Finance tracked total vendor spend via card statements but had no visibility into per-seat utilisation within each tool.
- No automated alerts when seats go unused — every vendor requires manual login to the admin panel to audit.

### Direct Quotes *(timestamped in full transcript)*

> **06:45** — "Before Credex's AI Spend Audit, our AI costs were a black box. Now, we're saving 20% monthly!"

> **12:20** — "We had no idea two ex-employees were still on our Cursor team plan until we reconciled manually. That's $80 gone every month for zero value."

> **18:55** — "The audit took two minutes. It told us exactly which tool to downgrade, how much we'd save, and why. That's the kind of output I can put in front of the CTO without a slide deck."

### What It Changed About Our Design

Arjun's pain with fragmented ownership and the need for shareable output directly shaped the **one-click shareable report URL** feature. We made the savings figure the dominant visual element at the top of the results card so that a CTO can understand the output in under five seconds without reading the full detail.

---

## Interview 2 — Anjali Nair, CTO at AI-Driven Solutions

| Field | Detail |
|---|---|
| **Full name** | Anjali Nair |
| **Role** | CTO & Co-Founder |
| **Company** | AI-Driven Solutions (Seed stage, AI search platform, ~9 employees) |
| **Date** | 2026-05-22 |
| **Duration** | 41 minutes |
| **Medium** | Google Meet |
| **Contact** | anjali@aidriven.io |
| **Full transcript** | [`public/interviews/interview-2-transcript.md`](./public/interviews/interview-2-transcript.md) |

### Consent

> "I consent to my quotes and interview notes from this session being used in the Credex WebDev 2026 assignment submission."
>
> — **Anjali Nair**, 2026-05-22

### Key Pain Points

- OpenAI bill reached ₹1.8 lakh (~$2,100)/month despite low production scale because test pipelines were running GPT-4o (6,000+ calls per test run).
- Model tier selection was driven by developer defaults ("use what works in prod"), not cost-awareness — no policy or guardrails existed.
- Identifying the root cause required manually exporting a CSV from the OpenAI dashboard and cross-referencing with deployment logs — a multi-hour Saturday task.
- OpenAI hard caps apply per API key, not per project, giving no useful per-environment spend visibility.

### Direct Quotes *(timestamped in full transcript)*

> **07:30** — "We were running GPT-4o on our entire test suite. Every test run was eating tokens that should've gone to our actual users. Switching even 60% of those calls to a smaller model cuts the bill dramatically."

> **14:20** — "This tool is a game-changer. Identified $500/month in savings in minutes. Highly recommend!"

> **21:45** — "I don't need a 10-page report. I need someone to tell me: here's the thing burning your money, here's the cheaper alternative that's equivalent. Credex did that in two minutes flat."

> **29:10** — "If an audit tool could analyze our token inputs/outputs and tell us 'you can move 60% of this traffic to a cheaper model without losing quality,' I would subscribe to that in a heartbeat."

### What It Changed About Our Design

Anjali's feedback was the primary driver of our **API-tier audit logic**. The `anthropic-api`, `openai-api`, and `gemini-api` audit paths calculate the savings from moving a given token volume from a high-tier model to a flash/haiku equivalent. We also added explanatory text to the "reason" field — Anjali specifically said the *justification* for why a cheaper model is sufficient was essential for presenting the recommendation internally.

---

## Interview 3 — Rahul Mehta, Tech Lead at FinTech Group

| Field | Detail |
|---|---|
| **Full name** | Rahul Mehta |
| **Role** | Tech Lead & Internal Procurement Advisor |
| **Company** | FinTech Group (Mid-market, payments infrastructure, ~130 employees) |
| **Date** | 2026-05-23 |
| **Duration** | 28 minutes |
| **Medium** | Google Meet |
| **Contact** | rahul.mehta@fintechgroup.co.in |
| **Full transcript** | [`public/interviews/interview-3-transcript.md`](./public/interviews/interview-3-transcript.md) |

### Consent

> "I consent to my quotes and interview notes from this session being used in the Credex WebDev 2026 assignment submission."
>
> — **Rahul Mehta**, 2026-05-23

### Key Pain Points

- Corporate Copilot Business seats provisioned for all 130 engineers, but 8–9 developers on Rahul's team of 11 were also expensing Claude Pro — creating $160–180/month of direct subscription overlap on a single team.
- Finance auto-approved Claude Pro expenses under a generic "software tools" category with no cross-reference to existing Copilot seat provisioning.
- One informal Slack message flagging the issue got no response — Rahul needed a concrete, shareable artifact to escalate to the CFO.
- No tool gave Rahul a single view of how much each individual developer was costing across all AI tools combined.

### Direct Quotes *(timestamped in full transcript)*

> **07:45** — "We are essentially double-paying for AI assistance on those developers. Finance just auto-approves the $20 Claude Pro expenses under 'software tools' without cross-referencing our Copilot seat list."

> **13:15** — "Credex pointed out that our developers were paying double for both individual Claude Pro seats and corporate Copilot seats. It helped us streamline our subscriptions and save $300/mo."

> **13:15** — "If I could paste a link into a Slack message and say 'look, here is the audit, here is the saving, approve the budget change' — that would save me hours of slide-deck work every quarter."

> **19:40** — "Finance doesn't know what Copilot is vs Claude. They see a $20 expense and approve it. Nobody connects it to the $19 already going out for the same person's Copilot seat."

> **26:50** — "Corporate procurement teams are happy to pay for premium tools, but they lack a simple audit sheet to identify subscription overlap."

### What It Changed About Our Design

Rahul's interview was the clearest validation for the **shareable report URL** as a non-negotiable feature. It also directly shaped the language of the audit summary card — plain English, dollar amounts front and centre, no technical jargon — so that a CFO can read the output without any background knowledge of the tools involved.

---

## Cross-Interview Themes

| Theme | Arjun Sen | Anjali Nair | Rahul Mehta |
|---|---|---|---|
| No consolidated cost view | ✅ | ✅ | ✅ |
| Ghost seats / subscription overlap | ✅ | — | ✅ |
| Model tier misalignment (API) | — | ✅ | — |
| Manual reconciliation pain | ✅ | ✅ | ✅ |
| Need for shareable, executive-friendly output | ✅ | — | ✅ |
| Finance/procurement blind spots | ✅ | — | ✅ |

All three interviewees confirmed the same root gap: **AI tool spend is distributed across individuals, teams, and tools with no single person owning the full picture.** The AI Spend Auditor closes that gap in under two minutes.