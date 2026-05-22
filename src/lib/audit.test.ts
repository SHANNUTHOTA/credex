import { runAudit } from "./audit";
import { describe, it, expect } from "vitest";

describe("Audit Engine", () => {
  it("should recommend switching to Pro plan for Cursor if Teams plan is used by single user", () => {
    const result = runAudit("cursor", 40, 1);
    expect(result.recommendedAction).toBe("Switch to the Pro plan");
    expect(result.savings).toBe(20);
  });

  it("should recommend optimizing usage with Credex for Cursor if spending more than Teams plan", () => {
    const result = runAudit("cursor", 100, 2);
    expect(result.recommendedAction).toBe("Optimize your usage with Credex");
    expect(result.savings).toBe(20); // 100 - (2 * 40) = 20
  });

  it("should find no savings for Cursor if spending is optimal", () => {
    const result = runAudit("cursor", 20, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to Individual plan for GitHub Copilot if Business plan is used by single user", () => {
    const result = runAudit("github-copilot", 19, 1);
    expect(result.recommendedAction).toBe("Switch to the Individual plan");
    expect(result.savings).toBe(9); // 19 - 10 = 9
  });

  it("should recommend contacting GitHub for a better deal if spending more than Enterprise plan", () => {
    const result = runAudit("github-copilot", 100, 2);
    expect(result.recommendedAction).toBe("Contact GitHub for a better deal");
    expect(result.savings).toBe(22); // 100 - (2 * 39) = 22
  });

  it("should recommend switching to Business plan for GitHub Copilot if spending is between Business and Enterprise", () => {
    const result = runAudit("github-copilot", 50, 2);
    expect(result.recommendedAction).toBe("Switch to the Business plan");
    expect(result.savings).toBe(12); // 50 - (2 * 19) = 12
  });

  it("should find no savings for GitHub Copilot if spending is optimal", () => {
    const result = runAudit("github-copilot", 10, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to Pro plan for Claude if Team plan is used by single user", () => {
    const result = runAudit("claude", 30, 1);
    expect(result.recommendedAction).toBe("Switch to the Pro plan");
    expect(result.savings).toBe(10); // 30 - 20 = 10
  });

  it("should recommend optimizing API usage with Credex for Claude if spending more than Team plan", () => {
    const result = runAudit("claude", 100, 2);
    expect(result.recommendedAction).toBe("Optimize your API usage with Credex");
    expect(result.savings).toBe(40); // 100 - (2 * 30) = 40
  });

  it("should find no savings for Claude if spending is optimal", () => {
    const result = runAudit("claude", 20, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to Plus plan for ChatGPT if Team plan is used by single user", () => {
    const result = runAudit("chatgpt", 30, 1);
    expect(result.recommendedAction).toBe("Switch to the Plus plan");
    expect(result.savings).toBe(10); // 30 - 20 = 10
  });

  it("should recommend optimizing usage with Credex for ChatGPT if spending more than Team plan", () => {
    const result = runAudit("chatgpt", 100, 2);
    expect(result.recommendedAction).toBe("Optimize your usage with Credex");
    expect(result.savings).toBe(40); // 100 - (2 * 30) = 40
  });

  it("should find no savings for ChatGPT if spending is optimal", () => {
    const result = runAudit("chatgpt", 20, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to Haiku model for Anthropic API if spending is higher", () => {
    const result = runAudit("anthropic-api", 100, undefined, 1, 1);
    expect(result.recommendedAction).toBe("Switch to the Haiku model");
    expect(result.savings).toBe(98.5); // 100 - (1*0.25 + 1*1.25) = 98.5
  });

  it("should find no savings for Anthropic API if spending is optimal", () => {
    const result = runAudit("anthropic-api", 1.5, undefined, 1, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to GPT-3.5 Turbo model for OpenAI API if spending is higher", () => {
    const result = runAudit("openai-api", 100, undefined, 1, 1);
    expect(result.recommendedAction).toBe("Switch to the GPT-3.5 Turbo model");
    expect(result.savings).toBe(98); // 100 - (1*0.5 + 1*1.5) = 98
  });

  it("should find no savings for OpenAI API if spending is optimal", () => {
    const result = runAudit("openai-api", 2, undefined, 1, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });

  it("should recommend switching to Gemini 1.5 Flash (128K context) for Gemini API if spending is higher", () => {
    const result = runAudit("gemini-api", 100, undefined, 1, 1);
    expect(result.recommendedAction).toBe("Switch to Gemini 1.5 Flash (128K context)");
    expect(result.savings).toBe(97.2); // 100 - (1*0.7 + 1*2.1) = 97.2
  });

  it("should find no savings for Gemini API if spending is optimal", () => {
    const result = runAudit("gemini-api", 2.8, undefined, 1, 1);
    expect(result.recommendedAction).toBe("No savings found");
    expect(result.savings).toBe(0);
  });
});
