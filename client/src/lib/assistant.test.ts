import { describe, it, expect, beforeEach } from "vitest";
import { buildHandoffPayload, EMPTY_INTAKE, type IntakeState } from "@/lib/assistant";
import { buildNetlifyFormBody, REVIEW_FORM_NAME } from "@/lib/leads";

// The hidden Netlify Forms stub in client/index.html defines the field set that
// Netlify registers for `private-review-request`. Every key the assistant
// submits must be declared here, or Netlify silently drops the submission and
// the email + Slack notifications never fire — which is the bug this guards.
const STUB_FIELDS = new Set([
  "name", "email", "phone", "state", "county", "producingStatus", "ownerStatus",
  "operatorInfo", "offerAmount", "urgency", "documents", "notes", "intent",
  "consent", "source_page", "landing_page", "referrer", "utm_source",
  "utm_medium", "utm_campaign", "utm_content", "utm_term", "bot-field",
]);

function setHash(hash: string) {
  window.history.replaceState(null, "", hash);
}

describe("buildHandoffPayload", () => {
  beforeEach(() => setHash("#/ask"));

  const intake: IntakeState = {
    ...EMPTY_INTAKE,
    state: "Texas",
    county: "Reeves",
    producingStatus: "producing",
    ownerStatus: "heir",
    operatorInfo: "Devon Energy, ~$120/mo",
    offerAmount: "$25,000",
    goal: "sell",
    notes: "Inherited from my father last year.",
  };

  const transcript = [
    { role: "user" as const, text: "Is this offer fair?" },
    { role: "assistant" as const, text: "An offer is one data point…" },
  ];

  it("includes every structured assistant field required by the spec", () => {
    const p = buildHandoffPayload({ name: "Jane Heir", email: "jane@example.com", phone: "555-1234", intake, transcript });
    expect(p.name).toBe("Jane Heir");
    expect(p.email).toBe("jane@example.com");
    expect(p.phone).toBe("555-1234");
    expect(p.state).toBe("Texas");
    expect(p.county).toBe("Reeves");
    expect(p.producingStatus).toBe("producing");
    expect(p.ownerStatus).toBe("heir");
    expect(p.operatorInfo).toBe("Devon Energy, ~$120/mo");
    expect(p.offerAmount).toBe("$25,000");
    expect(p.urgency).toBe("exploring"); // goal=sell
    expect(p.intent).toBe("assistant");
    expect(p.consent).toBe(true);
    expect(p.source_page).toBe("/ask");
    expect(String(p.landing_page)).toContain("/#/ask");
    // The transcript + intake are folded into the assistant summary (notes).
    expect(String(p.notes)).toContain("Assistant intake");
    expect(String(p.notes)).toContain("Is this offer fair?");
  });

  it("never emits undefined values (Netlify needs strings)", () => {
    const sparse = buildHandoffPayload({ name: "A B", email: "a@b.co", phone: "", intake: { ...EMPTY_INTAKE, state: "Oklahoma", goal: "understand" }, transcript: [] });
    for (const [key, value] of Object.entries(sparse)) {
      expect(value, `field ${key} should not be undefined`).not.toBeUndefined();
    }
    expect(sparse.producingStatus).toBe("not_sure");
    expect(sparse.ownerStatus).toBe("");
    expect(sparse.urgency).toBe(""); // goal !== sell
    expect(sparse.utm_content).toBe("assistant-inherited"); // goal=understand
  });

  it("only sends fields the registered Netlify stub declares", () => {
    const p = buildHandoffPayload({ name: "Jane", email: "j@e.co", phone: "", intake, transcript });
    for (const key of Object.keys(p)) {
      expect(STUB_FIELDS.has(key), `field "${key}" is not in the index.html stub`).toBe(true);
    }
  });
});

describe("buildNetlifyFormBody", () => {
  beforeEach(() => setHash("#/ask"));

  it("urlencodes form-name, honeypot, and folds the payload in", () => {
    const p = buildHandoffPayload({ name: "Jane Doe", email: "jane@example.com", phone: "", intake: { ...EMPTY_INTAKE, state: "Texas", goal: "sell" }, transcript: [] });
    const body = buildNetlifyFormBody(REVIEW_FORM_NAME, p);
    const parsed = new URLSearchParams(body);

    expect(parsed.get("form-name")).toBe("private-review-request");
    expect(parsed.get("bot-field")).toBe(""); // present-but-empty honeypot
    expect(parsed.get("name")).toBe("Jane Doe");
    expect(parsed.get("email")).toBe("jane@example.com");
    expect(parsed.get("intent")).toBe("assistant");
    expect(parsed.get("consent")).toBe("true"); // boolean serialized
    expect(parsed.get("state")).toBe("Texas");
    // Spaces survive urlencoding round-trip.
    expect(body).toContain("name=Jane+Doe");
  });
});
