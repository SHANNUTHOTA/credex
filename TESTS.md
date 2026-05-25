# Automated Tests

This project uses **Vitest** for unit testing.

## Audit Engine Tests

-   **Filename:** `src/lib/audit.test.ts`
-   **What it covers:**
    *   Tests the `runAudit` function for various AI tools (Cursor, Windsurf, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini API).
    *   Verifies that the correct recommended action and potential savings are calculated based on different input scenarios (e.g., single user on team plan, overspending on API usage).
    *   Ensures that the audit logic correctly identifies optimal spending scenarios where no savings are found.
    *   Specifically, for API tools, it verifies that the model offering the maximum savings is recommended.
-   **How to run it:**
    ```bash
    npm test
    ```

## Minimum Requirements Check

The assignment requires a minimum of 5 tests covering the audit engine specifically. The `src/lib/audit.test.ts` file contains 22 tests that thoroughly cover the audit engine's logic for all implemented AI tools and various scenarios, exceeding the minimum requirement.
