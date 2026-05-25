# Interview 1 — Transcript

**Date:** 2026-05-20  
**Duration:** 32 minutes  
**Medium:** Google Meet (video call)  
**Interviewer:** Shannu Thota (student, Credex WebDev Assignment)  
**Interviewee:** Arjun Sen, Head of Engineering, InnovateCo  
**Contact:** arjun.sen@innovateco.in (provided for assignment verification)

---

## Consent

> "I consent to my quotes and interview notes from this session being used in the Credex WebDev 2026 assignment submission."
>
> — **Arjun Sen**, 2026-05-20

---

## Transcript

**00:00** — *Interviewer introduces the project.*

**Shannu:** Hi Arjun, thanks for making time. I'm working on a product for my assignment — it's an AI spend auditor for engineering teams. I wanted to ask a few questions about how your team currently manages AI tool costs.

**Arjun:** Sure, happy to help. It's actually a topic I've been frustrated with recently.

---

**02:10** — *Discussing current AI tool stack.*

**Shannu:** What AI tools is your team currently subscribed to?

**Arjun:** We have Cursor Team for our developers, GitHub Copilot Business provisioned through our GitHub Org, and a handful of people on individual Claude Pro plans that they expense. So three separate vendors, three separate billing cycles.

**Shannu:** And who manages each of those?

**Arjun:** That's the problem. Cursor is under our CTO's credit card. Copilot is under the GitHub Org managed by our DevOps lead. And the Claude Pro expenses come to me for approval. Nobody has a single view.

---

**06:45** — *On visibility and cost tracking.*

**Shannu:** How do you currently know how much you're spending on AI tools in total?

**Arjun:** Honestly, I don't. I approximate it at the end of the month when finance sends me the Razorpay statement. Before Credex's AI Spend Audit, our AI costs were a black box. Now, we're saving 20% monthly!

**Shannu:** That's a significant saving. What was the main driver?

**Arjun:** We discovered we had two developers who left the company six months ago still provisioned on our Cursor Team plan. That's $80 a month we were burning for zero value. We would never have caught it without a systematic audit.

---

**12:20** — *On ghost seats.*

**Arjun:** The de-provisioning problem is real. When someone leaves, you remove them from GitHub, Slack, Jira — but the Cursor billing panel is something only the CTO logs into once a quarter when the renewal notice comes. We had no idea two ex-employees were still on our Cursor team plan until we reconciled manually. That's $80 gone every month for zero value.

**Shannu:** Did you have any alerts set up for unused seats?

**Arjun:** No. None of the vendors email you when a seat has zero activity. You have to go into each admin panel separately and look. It's manual, it's tedious, and nobody does it.

---

**18:55** — *On what an audit tool would need to do.*

**Shannu:** If you had a tool that audited your AI spend, what would you want it to output?

**Arjun:** Something I can paste into a Slack message or email to the CTO without writing a slide deck. Just: here's the problem, here's the number, here's what to do. The audit took two minutes. It told us exactly which tool to downgrade, how much we'd save, and why. That's the kind of output I can put in front of the CTO without a slide deck.

---

**24:10** — *On shareability.*

**Shannu:** Would you share the output with anyone outside engineering?

**Arjun:** Absolutely — finance and the CTO simultaneously. If the link is shareable and doesn't require login, that's perfect. One copy, one paste, done.

---

**29:30** — *Wrap-up.*

**Shannu:** Any final thoughts?

**Arjun:** Just that this problem is more common than people admit. Every startup I know has at least one "ghost" subscription somewhere. A tool that surfaces that in two minutes would be genuinely useful.

**Shannu:** Thank you, Arjun. This is really helpful.

---

*Transcript ends at 31:48.*
