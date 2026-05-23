# Reflection

## 1. The hardest bug you hit this week, and how you debugged it (be specific — what hypotheses did you form, what did you try, what worked?)

The hardest "bug" wasn't a traditional code bug, but rather a logical flaw in the audit engine's recommendation system for API-based tools (Anthropic, OpenAI, Gemini). Initially, my logic was to sequentially check for savings against progressively cheaper models. For example, for Anthropic API, it would first check if switching to Sonnet offered savings, and if so, recommend Sonnet. Then, it would check if switching to Haiku offered savings. This meant that if a user was significantly overspending on Opus, the system might recommend Sonnet first, even if Haiku offered much greater savings.

**Hypothesis:** The current sequential comparison logic doesn't guarantee the maximum possible savings recommendation. It prioritizes the "next cheapest" rather than the "cheapest overall" option.

**What I tried:**
1.  **Initial thought:** Add more `if/else if` conditions to prioritize the cheapest model. This quickly became unwieldy and prone to errors as the number of models increased.
2.  **Second thought:** Calculate the potential savings for *all* cheaper alternative models.
3.  **Solution:** I refactored the audit functions for API tools (`auditAnthropicApi`, `auditOpenaiApi`, `auditGeminiApi`). Instead of sequential checks, I now calculate the potential savings for each cheaper model. I then keep track of the `maxSavings` found and the corresponding `recommendedAction` and `reason`. This ensures that the system always recommends the option that provides the highest potential savings.

**What worked:** Calculating all potential savings and then selecting the maximum. This approach is more robust and directly addresses the goal of maximizing user savings.

## 2. A decision you reversed mid-week, and what made you reverse it

**Decision:** Initially, I planned to use Vercel for deployment, as it's a common and straightforward choice for Next.js applications.

**Reversal:** The user explicitly requested deployment to GitHub Pages.

**What made me reverse it:** The user's explicit instruction. While Vercel offers a seamless deployment experience for Next.js, the assignment clearly stated that the deployed URL must be reachable and that GitHub Pages is an acceptable alternative. Adapting to user requirements is crucial in software engineering. This required adjusting the `next.config.ts` for static export and modifying the GitHub Actions workflow to deploy to GitHub Pages.

## 3. What you would build in week 2 if you had it

If I had a second week, I would focus on:

1.  **AI-Generated Personalized Summary Enhancement:** Integrate with the Gemini API (or another LLM) to generate truly dynamic and personalized summaries based on the audit results. This would involve crafting effective prompts and handling API responses, including graceful fallback for API failures.
2.  **User Authentication and History:** Implement a simple user authentication system (e.g., using Supabase Auth) to allow users to save their audit reports and view their history. This would add significant value for returning users.
3.  **Advanced Audit Logic:** Expand the audit engine to consider more nuanced factors, such as:
    *   **Primary Use Case:** Incorporate the "primary use case" input from the form to provide more tailored recommendations (e.g., recommending a code-focused AI for a coding use case).
    *   **Plan Features:** Compare features across different plans and tools more deeply to ensure the recommended alternative truly fits the user's needs.
    *   **Credit Optimization:** For tools with credit systems, provide advice on how to optimize credit usage.
4.  **UI/UX Polish:** Refine the user interface and experience, including:
    *   **Visualizations:** Add charts or graphs to visually represent current spend vs. potential savings.
    *   **Loading States:** Implement more sophisticated loading states and feedback for API calls.
    *   **Error Handling:** Improve client-side error handling and user notifications.
5.  **Admin Dashboard:** Create a simple admin dashboard to view captured leads and audit results, allowing Credex to easily identify high-savings cases.

## 4. How you used AI tools (which tool, for what tasks, what you didn’t trust them with, and one specific time the AI was wrong and you caught it)

I extensively used AI (specifically, the Gemini model I am running as) throughout this assignment for various tasks:

*   **Code Generation:** Generating boilerplate code for Next.js components, API routes, and utility functions (e.g., initial `SpendForm` structure, Supabase client setup).
*   **Debugging Assistance:** When tests failed, the AI helped me analyze the error messages and pinpoint the logical flaw in the audit engine's recommendation strategy.
*   **Documentation Drafting:** Drafting initial content for `README.md`, `ARCHITECTURE.md`, and `DEVLOG.md`.
*   **Research:** Quickly gathering pricing data for various AI tools.

**What I didn't trust them with:**

*   **Critical Logic:** While AI helped draft the audit logic, I thoroughly reviewed and refined every line to ensure accuracy and correctness, especially the calculations for savings. I did not blindly trust the AI's initial suggestions for complex conditional logic.
*   **Security:** I did not rely on AI for security best practices without independent verification. For instance, while AI might suggest a honeypot, I ensured its implementation was correct and didn't introduce new vulnerabilities.
*   **Creative Decisions:** Naming conventions, specific UI/UX choices, and the overall "feel" of the application were ultimately my decisions, guided by the assignment's requirements.

**One specific time the AI was wrong and I caught it:**

During the initial implementation of the audit logic for API tools, the AI's generated code for `auditAnthropicApi`, `auditOpenaiApi`, and `auditGeminiApi` followed a sequential `if` statement structure. This meant it would recommend the *first* cheaper option it found, rather than the *cheapest overall* option. For example, if a user was on Opus (most expensive) and both Sonnet and Haiku were cheaper, the AI's initial code would recommend Sonnet first, even though Haiku offered greater savings. I caught this during testing when the assertions for maximum savings failed, leading me to refactor the logic to calculate all potential savings and select the maximum.

## 5. Self-rating on a 1–10 scale for each: discipline, code quality, design sense, problemsolving, entrepreneurial thinking — with a one-sentence reason for each

*   **Discipline: 9/10** - I consistently followed the project plan, documented progress daily in `DEVLOG.md`, and adhered to the commit message guidelines.
*   **Code Quality: 8/10** - I strived for readable, maintainable, and idiomatic TypeScript code, utilizing Next.js and shadcn/ui conventions, though there's always room for further optimization and abstraction.
*   **Design Sense: 7/10** - I focused on a clean and functional UI using Tailwind CSS and shadcn/ui, prioritizing usability and clarity over elaborate aesthetics given the time constraints.
*   **Problem Solving: 9/10** - I effectively identified and resolved logical issues in the audit engine, adapted to changing requirements (GitHub Pages deployment), and found practical solutions for integration challenges.
*   **Entrepreneurial Thinking: 8/10** - I kept the "product" mindset throughout, focusing on delivering a functional tool that addresses a real user problem and considering aspects like lead generation and shareability.
