import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// _shared.mjs reads SLACK_WEBHOOK_URL at module load, so set it before the
// dynamic import below. SUPABASE/RESEND are left unset → those paths no-op.
process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.test/services/XXX";

const SLACK_URL = process.env.SLACK_WEBHOOK_URL;

const { default: handler } = await import("./assistant-lead.mjs");
const { buildLeadSlackMessage } = await import("./_shared.mjs");

function postRequest(body) {
  return new Request("https://site/api/assistant-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const VALID = {
  name: "Perplexity QA Assistant Fixed Handoff Test",
  email: "g.knight@oklahomaminerals.com",
  state: "Oklahoma",
  county: "Kingfisher",
  producingStatus: "producing",
  ownerStatus: "heir",
  notes: "— Assistant intake —\nGoal: Explore selling\nState: Oklahoma",
  intent: "assistant",
  source_page: "/ask",
  landing_page: "https://www.inheritedmineralrights.com/#/ask",
};

describe("assistant-lead function", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it("rejects non-POST", async () => {
    const res = await handler(new Request("https://site/api/assistant-lead", { method: "GET" }));
    expect(res.status).toBe(405);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates name and email before posting to Slack", async () => {
    const res = await handler(postRequest({ name: "A", email: "bad" }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the lead to Slack and returns 201 on success", async () => {
    const res = await handler(postRequest(VALID));
    expect(res.status).toBe(201);
    const payload = await res.json();
    expect(payload.ok).toBe(true);

    // Slack was called once, at the configured webhook, with our fields.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(SLACK_URL);
    const sent = JSON.parse(opts.body);
    expect(sent.text).toContain("assistant handoff");
    expect(sent.text).toContain(VALID.email);
    expect(sent.text).toContain("Oklahoma");
    expect(sent.text).toContain("Intent:* assistant");
    // QA test leads are flagged so they're distinguishable in #inherited.
    expect(sent.text).toContain("TEST");
  });

  it("returns 502 (no false success) when Slack delivery fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 500 }));
    const res = await handler(postRequest(VALID));
    expect(res.status).toBe(502);
    const payload = await res.json();
    expect(payload.ok).toBeUndefined();
  });
});

describe("buildLeadSlackMessage", () => {
  it("skips empty fields and marks real leads with a bell", () => {
    const msg = buildLeadSlackMessage({
      title: "New lead — assistant handoff",
      fields: [["Name", "Jane Doe"], ["Phone", ""], ["State", "Texas"]],
      meta: "Submitted: now",
    });
    expect(msg.text).toContain(":bell:");
    expect(msg.text).toContain("*Name:* Jane Doe");
    expect(msg.text).toContain("*State:* Texas");
    expect(msg.text).not.toContain("Phone");
  });
});
