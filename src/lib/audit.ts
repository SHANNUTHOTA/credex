// This file will contain the logic for the audit engine.
// It will export functions to calculate potential savings based on user input.

export interface AuditResult {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

const CURSOR_PRO_PRICE = 20;
const CURSOR_TEAMS_PRICE = 40;
const GITHUB_COPILOT_INDIVIDUAL_PRICE = 10;
const GITHUB_COPILOT_BUSINESS_PRICE = 19;
const GITHUB_COPILOT_ENTERPRISE_PRICE = 39;
const CLAUDE_PRO_PRICE = 20;
const CLAUDE_TEAM_PRICE = 30;
const CHATGPT_PLUS_PRICE = 20;
const CHATGPT_TEAM_PRICE = 30; // Assuming monthly billing

const ANTHROPIC_API_PRICING = {
    sonnet: {
        input: 3,
        output: 15,
    },
    opus: {
        input: 15,
        output: 75,
    },
    haiku: {
        input: 0.25,
        output: 1.25,
    }
}

const OPENAI_API_PRICING = {
    "gpt-4o": {
        input: 5,
        output: 15,
    },
    "gpt-4-turbo": {
        input: 10,
        output: 30,
    },
    "gpt-3.5-turbo": {
        input: 0.5,
        output: 1.5,
    }
}

const GEMINI_API_PRICING = {
    "gemini-1.5-pro-128k": {
        input: 3.5,
        output: 10.5,
    },
    "gemini-1.5-pro-1m": {
        input: 7,
        output: 21,
    },
    "gemini-1.5-flash-128k": {
        input: 0.7,
        output: 2.1,
    },
    "gemini-1.5-flash-1m": {
        input: 0.35,
        output: 1.05,
    }
}

function auditCursor(monthlySpend: number, seats: number): AuditResult {
  if (seats === 1 && monthlySpend >= CURSOR_TEAMS_PRICE) {
    const savings = monthlySpend - CURSOR_PRO_PRICE;
    if (savings > 0) {
      return {
        tool: "Cursor",
        currentSpend: monthlySpend,
        recommendedAction: "Switch to the Pro plan",
        savings,
        reason: "The Teams plan is overkill for a single user. You can get all the features you need with the Pro plan.",
      };
    }
  }

  if (monthlySpend > (seats * CURSOR_TEAMS_PRICE)) {
    return {
      tool: "Cursor",
      currentSpend: monthlySpend,
      recommendedAction: "Optimize your usage with Credex",
      savings: monthlySpend - (seats * CURSOR_TEAMS_PRICE),
      reason: "You are spending more than the standard team plan. Credex can help you get a better deal on your credits.",
    };
  }

  return {
    tool: "Cursor",
    currentSpend: monthlySpend,
    recommendedAction: "No savings found",
    savings: 0,
    reason: "Your spending seems optimal for your team size.",
  };
}

function auditGitHubCopilot(monthlySpend: number, seats: number): AuditResult {
  const spendPerSeat = monthlySpend / seats;

  if (seats === 1 && spendPerSeat >= GITHUB_COPILOT_BUSINESS_PRICE) {
    const savings = monthlySpend - GITHUB_COPILOT_INDIVIDUAL_PRICE;
    if (savings > 0) {
      return {
        tool: "GitHub Copilot",
        currentSpend: monthlySpend,
        recommendedAction: "Switch to the Individual plan",
        savings,
        reason: "The Business plan is not necessary for a single user.",
      };
    }
  }

  if (spendPerSeat > GITHUB_COPILOT_ENTERPRISE_PRICE) {
    return {
      tool: "GitHub Copilot",
      currentSpend: monthlySpend,
      recommendedAction: "Contact GitHub for a better deal",
      savings: monthlySpend - (seats * GITHUB_COPILOT_ENTERPRISE_PRICE),
      reason: "You are spending more than the standard Enterprise plan. You might be able to get a better deal from GitHub.",
    };
  }
  
  if (spendPerSeat > GITHUB_COPILOT_BUSINESS_PRICE && spendPerSeat <= GITHUB_COPILOT_ENTERPRISE_PRICE) {
      const savings = monthlySpend - (seats * GITHUB_COPILOT_BUSINESS_PRICE);
      if (savings > 0) {
        return {
            tool: "GitHub Copilot",
            currentSpend: monthlySpend,
            recommendedAction: "Switch to the Business plan",
            savings,
            reason: "You can get the features you need for a lower price with the Business plan.",
        };
      }
  }

  return {
    tool: "GitHub Copilot",
    currentSpend: monthlySpend,
    recommendedAction: "No savings found",
    savings: 0,
    reason: "Your spending seems optimal for your team size.",
  };
}

function auditClaude(monthlySpend: number, seats: number): AuditResult {
    const spendPerSeat = monthlySpend / seats;

    if (seats === 1 && spendPerSeat >= CLAUDE_TEAM_PRICE) {
        const savings = monthlySpend - CLAUDE_PRO_PRICE;
        if (savings > 0) {
            return {
                tool: "Claude",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the Pro plan",
                savings,
                reason: "The Team plan is not necessary for a single user.",
            };
        }
    }

    if (spendPerSeat > CLAUDE_TEAM_PRICE) {
        return {
            tool: "Claude",
            currentSpend: monthlySpend,
            recommendedAction: "Optimize your API usage with Credex",
            savings: monthlySpend - (seats * CLAUDE_TEAM_PRICE),
            reason: "You are spending more than the standard team plan, which may indicate heavy API usage. Credex can help you get a better deal on your API credits.",
        };
    }

    return {
        tool: "Claude",
        currentSpend: monthlySpend,
        recommendedAction: "No savings found",
        savings: 0,
        reason: "Your spending seems optimal for your team size.",
    };
}

function auditChatGPT(monthlySpend: number, seats: number): AuditResult {
    const spendPerSeat = monthlySpend / seats;

    if (seats === 1 && spendPerSeat >= CHATGPT_TEAM_PRICE) {
        const savings = monthlySpend - CHATGPT_PLUS_PRICE;
        if (savings > 0) {
            return {
                tool: "ChatGPT",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the Plus plan",
                savings,
                reason: "The Team plan is not necessary for a single user.",
            };
        }
    }

    if (spendPerSeat > CHATGPT_TEAM_PRICE) {
        return {
            tool: "ChatGPT",
            currentSpend: monthlySpend,
            recommendedAction: "Optimize your usage with Credex",
            savings: monthlySpend - (seats * CHATGPT_TEAM_PRICE),
            reason: "You are spending more than the standard team plan, which may indicate heavy API usage or that you are on the Enterprise plan. Credex can help you get a better deal.",
        };
    }

    return {
        tool: "ChatGPT",
        currentSpend: monthlySpend,
        recommendedAction: "No savings found",
        savings: 0,
        reason: "Your spending seems optimal for your team size.",
    };
}

function auditAnthropicApi(monthlySpend: number, inputTokens: number, outputTokens: number): AuditResult {
    const sonnetCost = (inputTokens * ANTHROPIC_API_PRICING.sonnet.input) + (outputTokens * ANTHROPIC_API_PRICING.sonnet.output);
    const haikuCost = (inputTokens * ANTHROPIC_API_PRICING.haiku.input) + (outputTokens * ANTHROPIC_API_PRICING.haiku.output);

    if (monthlySpend > sonnetCost) {
        const savings = monthlySpend - sonnetCost;
        if (savings > 0) {
            return {
                tool: "Anthropic API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the Sonnet model",
                savings,
                reason: "Based on your usage, the Sonnet model can provide a good balance of performance and cost.",
            };
        }
    }
    
    if (monthlySpend > haikuCost) {
        const savings = monthlySpend - haikuCost;
        if (savings > 0) {
            return {
                tool: "Anthropic API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the Haiku model",
                savings,
                reason: "For less complex tasks, the Haiku model can provide significant savings.",
            };
        }
    }

    return {
        tool: "Anthropic API",
        currentSpend: monthlySpend,
        recommendedAction: "No savings found",
        savings: 0,
        reason: "Your spending seems optimal for your usage.",
    };
}

function auditOpenaiApi(monthlySpend: number, inputTokens: number, outputTokens: number): AuditResult {
    const gpt4oCost = (inputTokens * OPENAI_API_PRICING["gpt-4o"].input) + (outputTokens * OPENAI_API_PRICING["gpt-4o"].output);
    const gpt35TurboCost = (inputTokens * OPENAI_API_PRICING["gpt-3.5-turbo"].input) + (outputTokens * OPENAI_API_PRICING["gpt-3.5-turbo"].output);

    if (monthlySpend > gpt4oCost) {
        const savings = monthlySpend - gpt4oCost;
        if (savings > 0) {
            return {
                tool: "OpenAI API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the GPT-4o model",
                savings,
                reason: "Based on your usage, the GPT-4o model can provide a good balance of performance and cost.",
            };
        }
    }

    if (monthlySpend > gpt35TurboCost) {
        const savings = monthlySpend - gpt35TurboCost;
        if (savings > 0) {
            return {
                tool: "OpenAI API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to the GPT-3.5 Turbo model",
                savings,
                reason: "For less complex tasks, the GPT-3.5 Turbo model can provide significant savings.",
            };
        }
    }

    return {
        tool: "OpenAI API",
        currentSpend: monthlySpend,
        recommendedAction: "No savings found",
        savings: 0,
        reason: "Your spending seems optimal for your usage.",
    };
}

function auditGeminiApi(monthlySpend: number, inputTokens: number, outputTokens: number): AuditResult {
    const gemini15Pro128kCost = (inputTokens * GEMINI_API_PRICING["gemini-1.5-pro-128k"].input) + (outputTokens * GEMINI_API_PRICING["gemini-1.5-pro-128k"].output);
    const gemini15Flash128kCost = (inputTokens * GEMINI_API_PRICING["gemini-1.5-flash-128k"].input) + (outputTokens * GEMINI_API_PRICING["gemini-1.5-flash-128k"].output);

    if (monthlySpend > gemini15Pro128kCost) {
        const savings = monthlySpend - gemini15Pro128kCost;
        if (savings > 0) {
            return {
                tool: "Gemini API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Gemini 1.5 Pro (128K context)",
                savings,
                reason: "Based on your usage, Gemini 1.5 Pro with 128K context can provide a good balance of performance and cost.",
            };
        }
    }

    if (monthlySpend > gemini15Flash128kCost) {
        const savings = monthlySpend - gemini15Flash128kCost;
        if (savings > 0) {
            return {
                tool: "Gemini API",
                currentSpend: monthlySpend,
                recommendedAction: "Switch to Gemini 1.5 Flash (128K context)",
                savings,
                reason: "For less complex tasks, Gemini 1.5 Flash with 128K context can provide significant savings.",
            };
        }
    }

    return {
        tool: "Gemini API",
        currentSpend: monthlySpend,
        recommendedAction: "No savings found",
        savings: 0,
        reason: "Your spending seems optimal for your usage.",
    };
}


export function runAudit(
  tool: string,
  monthlySpend: number,
  seats?: number,
  inputTokens?: number,
  outputTokens?: number,
): AuditResult {
  switch (tool) {
    case "cursor":
      return auditCursor(monthlySpend, seats!);
    case "github-copilot":
      return auditGitHubCopilot(monthlySpend, seats!);
    case "claude":
        return auditClaude(monthlySpend, seats!);
    case "chatgpt":
        return auditChatGPT(monthlySpend, seats!);
    case "anthropic-api":
        return auditAnthropicApi(monthlySpend, inputTokens!, outputTokens!);
    case "openai-api":
        return auditOpenaiApi(monthlySpend, inputTokens!, outputTokens!);
    case "gemini-api":
        return auditGeminiApi(monthlySpend, inputTokens!, outputTokens!);
    default:
      return {
        tool,
        currentSpend: monthlySpend,
        recommendedAction: "No audit logic available yet",
        savings: 0,
        reason: "We are still building the audit logic for this tool.",
      };
  }
}
