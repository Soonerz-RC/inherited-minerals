import { describe, it, expect } from "vitest";
import { mapLeadToAirtableFields } from "./_shared.mjs";

describe("mapLeadToAirtableFields", () => {
  it("maps a full landing-form lead to the Leads table fields", () => {
    const fields = mapLeadToAirtableFields(
      {
        name: "Jane Heir",
        email: "jane@example.com",
        phone: "555-1234",
        source: "Landing form",
        intent: "offer",
        state: "Oklahoma",
        county: "Carter",
        operatorInfo: "Acme Oil, 1/8 royalty",
        offerAmount: "$50,000",
        producingStatus: "producing",
        ownerStatus: "sole",
        notes: "Wants a quick valuation.",
        questions_asked: "What is my interest worth?",
        landing_page: "https://www.inheritedmineralrights.com/got-an-offer",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "offer-2026",
        submitted_at: "2026-06-02T12:00:00.000Z",
      },
      { slackPosted: true },
    );

    expect(fields).toMatchObject({
      "Lead name": "Jane Heir",
      Email: "jane@example.com",
      Phone: "555-1234",
      Source: "Landing form",
      Intent: "offer",
      Status: "New",
      Priority: "Medium",
      State: "Oklahoma",
      County: "Carter",
      "Operator / Royalty Info": "Acme Oil, 1/8 royalty",
      "Offer Amount": "$50,000",
      "Producing Status": "producing",
      "Owner Status": "sole",
      Notes: "Wants a quick valuation.",
      "Questions Asked": "What is my interest worth?",
      "Landing Page": "https://www.inheritedmineralrights.com/got-an-offer",
      "UTM Source": "google",
      "UTM Medium": "cpc",
      "UTM Campaign": "offer-2026",
      "Submitted At": "2026-06-02T12:00:00.000Z",
      "Slack Posted": "true",
    });
  });

  it("derives Source='Assistant' for assistant-intent leads with no explicit source", () => {
    const fields = mapLeadToAirtableFields({ intent: "assistant", email: "a@b.co" });
    expect(fields.Source).toBe("Assistant");
    expect(fields.Intent).toBe("assistant");
  });

  it("resolves alias keys (operator_info, offer_amount, producing_status, owner_status)", () => {
    const fields = mapLeadToAirtableFields({
      lead_name: "Sam Owner",
      operator_info: "Big Operator",
      offer_amount: "$10k",
      producing_status: "not_sure",
      owner_status: "co_owner",
    });
    expect(fields["Lead name"]).toBe("Sam Owner");
    expect(fields["Operator / Royalty Info"]).toBe("Big Operator");
    expect(fields["Offer Amount"]).toBe("$10k");
    expect(fields["Producing Status"]).toBe("not_sure");
    expect(fields["Owner Status"]).toBe("co_owner");
  });

  it("extracts Questions Asked from an assistant summary note when no explicit field", () => {
    const notes = [
      "— Assistant intake —",
      "Goal: Explore selling",
      "",
      "— Questions asked —",
      "• How do I know if my minerals are producing?",
      "• Should I accept this offer?",
    ].join("\n");
    const fields = mapLeadToAirtableFields({ intent: "assistant", notes });
    expect(fields["Questions Asked"]).toBe(
      "How do I know if my minerals are producing?\nShould I accept this offer?",
    );
    expect(fields.Notes).toContain("Assistant intake");
  });

  it("always sets Status=New, Priority=Medium and defaults Submitted At to now", () => {
    const before = Date.now();
    const fields = mapLeadToAirtableFields({ email: "x@y.co" });
    expect(fields.Status).toBe("New");
    expect(fields.Priority).toBe("Medium");
    const ts = Date.parse(fields["Submitted At"]);
    expect(ts).toBeGreaterThanOrEqual(before);
  });

  it("records Slack Posted=false when Slack did not succeed", () => {
    const fields = mapLeadToAirtableFields({ email: "x@y.co" }, { slackPosted: false });
    expect(fields["Slack Posted"]).toBe("false");
  });

  it("omits empty/null fields rather than writing blanks", () => {
    const fields = mapLeadToAirtableFields({ email: "x@y.co", phone: "" });
    expect(fields).not.toHaveProperty("Phone");
    expect(fields).not.toHaveProperty("County");
    expect(fields).toHaveProperty("Email");
  });
});
