## AI Prompts Used

### Audit Summary Prompt (Anthropic / Gemini / GPT)
Prompt:
```
You are an assistant that summarizes an AI spend audit for a startup engineering team in ~100 words.
Input: a JSON object with `tools` (array of {name, plan, monthlySpend, seats}), `teamSize`, `primaryUseCase`, and `savingsSummary` (total monthly and annual savings and per-tool breakdown).
Output: A friendly, actionable 100-word summary the user can paste into an email. If `savingsSummary.totalMonthly` > 500, include a short sales CTA recommending Credex.
If the LLM call fails, return a templated summary using the numbers and a one-line CTA placeholder.
```

### LLM Safety and Fallbacks
- On API timeout or error, fall back to the templated summary: "Based on your inputs, we estimate $X/mo savings. Reply to this email to learn more."
- Do not include personally-identifying information in the public summary.

### Why these prompts
- The prompt is narrowly scoped to avoid hallucination and to produce concise, shareable language suitable for email or Open Graph snippets.

### Iterations / experiments
- Tried asking for bulleted pros/cons first, but that increased latency and complexity; settled on a single concise paragraph to meet the UX goal.

### How to reproduce
1. Call the LLM with the `Audit Summary Prompt` and a JSON-encoded context.
2. If the model returns an error, generate the templated fallback using the computed numbers.

---

Feel free to edit these prompts to tune tone and length for your preferred LLM.
