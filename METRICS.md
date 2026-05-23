# Metrics

## Your single North Star metric and why

**North Star Metric: Qualified Leads Generated for Credex**

**Why:** The primary purpose of this free tool is to serve as a lead-generation asset for Credex. A "qualified lead" is defined as a user who completes an audit, identifies significant potential savings (e.g., >$500/month), and provides their contact information. This metric directly aligns with Credex's business objective of acquiring new customers for its discounted AI infrastructure credits.

## 3 input metrics that drive the North Star

1.  **Unique Audit Completions:** The number of distinct users who successfully complete the AI spend audit and view their results. This is a funnel metric that directly feeds into lead generation.
2.  **Share Rate of Audit Reports:** The percentage of users who share their audit report via the unique URL. A higher share rate indicates stronger product-market fit and expands the tool's reach organically.
3.  **Conversion Rate (Audit Completion to Lead Capture):** The percentage of users who, after completing an audit and seeing potential savings, opt to provide their contact information. This measures the effectiveness of the lead capture mechanism.

## What you'd instrument first

I would instrument **Unique Audit Completions** first. This is the foundational metric. Without users completing the audit, no leads can be generated. Tracking this would involve:
*   Event tracking on the "Audit My Spend" button click.
*   Event tracking on the successful display of the audit results page.

## What number triggers a pivot decision

**Pivot Trigger: Less than 1% Conversion Rate from Unique Audit Completions to Qualified Leads after 3 months.**

**Why:** If the tool consistently fails to convert a meaningful portion of its users into qualified leads, it indicates a fundamental problem with either the value proposition, the lead capture mechanism, or the targeting. A pivot would be necessary to re-evaluate the tool's design, marketing, or Credex's offering itself. This threshold allows for initial iteration and learning but signals a need for significant change if not met.
