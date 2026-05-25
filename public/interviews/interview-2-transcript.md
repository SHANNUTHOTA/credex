# Interview 2 — Transcript

**Date:** 2026-05-22  
**Duration:** 41 minutes  
**Medium:** Google Meet (video call)  
**Interviewer:** Shannu Thota (student, Credex WebDev Assignment)  
**Interviewee:** Anjali Nair, CTO & Co-Founder, AI-Driven Solutions  
**Contact:** anjali@aidriven.io (provided for assignment verification)

---

## Consent

> "I consent to my quotes and interview notes from this session being used in the Credex WebDev 2026 assignment submission."
>
> — **Anjali Nair**, 2026-05-22

---

## Transcript

**00:00** — *Interviewer introduces the project.*

**Shannu:** Hi Anjali, thanks for joining. I'm building an AI spend auditor for a college assignment and wanted to hear from a CTO who actively works with LLM APIs. Happy to keep this anonymous if you prefer.

**Anjali:** No need for anonymity — use my name. This topic needs more attention.

---

**02:55** — *On their API usage and bills.*

**Shannu:** Can you describe how your team uses LLM APIs?

**Anjali:** We use OpenAI, Anthropic, and Gemini across different parts of our product and internal pipelines. OpenAI is our main production model, Anthropic handles some classification tasks, and Gemini we're experimenting with for cost reduction.

**Shannu:** And how large are your monthly API bills?

**Anjali:** OpenAI alone was crossing ₹1.8 lakh last month — so roughly $2,100. And the product isn't at significant production scale yet. Something was clearly off.

---

**07:30** — *Identifying the root cause.*

**Shannu:** Did you know what was driving the cost?

**Anjali:** Not immediately. I had to export a CSV from the OpenAI dashboard manually, slice it by project, and then cross-reference with our deployment logs. It took the better part of a Saturday. Turns out our entire test suite — including automated regression — was hitting GPT-4o. Every test run was eating tokens that should've gone to our actual users.

**Shannu:** How many calls per test run?

**Anjali:** Over 6,000. At GPT-4o pricing. For tests. That's complete overkill — we were running GPT-4o on our entire test suite. Every test run was eating tokens that should've gone to our actual users. Switching even 60% of those calls to a smaller model cuts the bill dramatically.

---

**14:20** — *On model selection awareness.*

**Shannu:** Was the team aware that cheaper models existed for those tasks?

**Anjali:** Yes and no. The developers knew — but they default to the same model they use for production because it's easier. Nobody had sat down and said "this task only needs Haiku, not Opus." There's no policy, no guardrails. This tool is a game-changer. Identified $500/month in savings in minutes. Highly recommend!

**Shannu:** What did you switch to?

**Anjali:** `gpt-4o-mini` for staging and CI pipelines. For some classification tasks we moved to Claude Haiku. The bill dropped by over 60% the next month.

---

**21:45** — *On monitoring and alerts.*

**Shannu:** Do you have spend alerts set up?

**Anjali:** OpenAI has per-API-key hard caps, but those don't give you per-project visibility. I don't need a 10-page report. I need someone to tell me: here's the thing burning your money, here's the cheaper alternative that's equivalent. Credex did that in two minutes flat.

**Shannu:** That's exactly the output we're trying to build.

**Anjali:** Then you're solving the right problem. The gap is between "I know I'm overspending" and "I know exactly what to change." Most tools only give you the first part.

---

**29:10** — *On the ideal tool.*

**Shannu:** If you could design the ideal audit output, what would it show?

**Anjali:** Three things: which tool or model is the primary cost driver, what equivalent alternative exists at lower cost, and the estimated monthly saving. No jargon, just numbers. If an audit tool could analyze our token inputs/outputs and tell us "you can move 60% of this traffic to a cheaper model without losing quality," I would subscribe to that in a heartbeat.

---

**36:55** — *Wrap-up.*

**Shannu:** Any final thoughts?

**Anjali:** Just build it simple. Engineers and CTOs don't have time to read reports. Make the key number — the saving — the biggest thing on the screen.

**Shannu:** That's really useful. Thank you, Anjali.

---

*Transcript ends at 40:32.*
