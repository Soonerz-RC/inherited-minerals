import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { normalizeBlandCall, isSubstantiveCall } from "../functions/bland-call-lead.mjs";

const SLACK_URL = "https://hooks.slack.test/webhook";
const AIRTABLE_HOST = "api.airtable.com";

async function loadHandler(env = {}) {
  vi.resetModules();
  process.env.SLACK_WEBHOOK_URL = SLACK_URL;
  delete process.env.AIRTABLE_PAT;
  delete process.env.AIRTABLE_API_KEY;
  delete process.env.BLAND_WEBHOOK_SECRET;
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const mod = await import("../functions/bland-call-lead.mjs");
  return mod.default;
}

function makeReq(body, { headers = {}, url } = {}) {
  return new Request(url || "https://site.test/.netlify/functions/bland-call-lead", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// A representative Bland post-call payload with nested variables.
const BLAND_PAYLOAD = {
  call_id: "call_abc123",
  from: "+14055551234",
  to: "+14054508680",
  status: "completed",
  completed: true,
  call_length: "4.2",
  recording_url: "https://bland.test/recording/abc123.mp3",
  summary: "Caller inherited minerals in Reeves County and wants to sell.",
  ended_at: "2026-06-02T18:30:00.000Z",
  variables: {
    primary_intent: "sell",
    full_name: "Jane Heir",
    email: "jane@example.com",
    mineral_state: "Texas",
    mineral_county: "Reeves",
    offer_amount: "$25,000",
    operator_info: "Operator XYZ",
    ownership_status: "Confirmed owner",
    royalty_check_status: "Receiving checks",
    questions_asked: "Is the offer fair?",
  },
};

// A sparse/interim Bland event like the ones that created duplicate leads:
// only a call id and the from/to numbers, no summary or collected variables.
const SPARSE_PAYLOAD = {
  call_id: "ca362365-4067-455a-b2bb-9c9290bf73dc",
  from: "+14055551234",
  to: "+14054508680",
  timestamp: "2026-06-02T18:29:00.000Z",
};

describe("isSubstantiveCall", () => {
  it("ignores a sparse interim event with only call id + numbers + timestamp", () => {
    const result = isSubstantiveCall(SPARSE_PAYLOAD);
    expect(result.ok).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it("accepts the good completed payload", () => {
    expect(isSubstantiveCall(BLAND_PAYLOAD).ok).toBe(true);
  });

  it("accepts an event that only has a summary", () => {
    expect(isSubstantiveCall({ call_id: "x", summary: "Caller wants to sell." }).ok).toBe(true);
  });

  it("accepts an event with a transcript and no summary", () => {
    expect(isSubstantiveCall({ call_id: "x", transcript: "Agent: hello..." }).ok).toBe(true);
  });

  it("accepts an event with collected variables and no active status", () => {
    expect(
      isSubstantiveCall({ call_id: "x", from: "+14055550000", variables: { full_name: "Jim Payload" } }).ok,
    ).toBe(true);
  });

  it("ignores an event whose only variable is present but status is in-progress", () => {
    const result = isSubstantiveCall({
      call_id: "x",
      status: "in-progress",
      variables: { full_name: "Jim Payload" },
    });
    expect(result.ok).toBe(false);
  });
});

describe("normalizeBlandCall", () => {
  it("maps nested variables and top-level call fields into the lead shape", () => {
    const { data, meta } = normalizeBlandCall(BLAND_PAYLOAD);

    expect(data.form_name).toBe("phone-lead");
    expect(data.source).toBe("Phone");
    expect(data.intent).toBe("sell");
    expect(data.name).toBe("Jane Heir");
    expect(data.phone).toBe("+14055551234"); // from `from`, not the Bland DID `to`
    expect(data.email).toBe("jane@example.com");
    expect(data.state).toBe("Texas");
    expect(data.county).toBe("Reeves");
    expect(data.offer_amount).toBe("$25,000");
    expect(data.operator_info).toBe("Operator XYZ");
    expect(data.owner_status).toBe("Confirmed owner");
    expect(data.producing_status).toBe("Receiving checks");
    expect(data.questions_asked).toBe("Is the offer fair?");
    expect(data.utm_source).toBe("phone");
    expect(data.utm_medium).toBe("call");
    expect(data.utm_campaign).toBe("inherited_minerals_phone");
    expect(data.landing_page).toBe("https://www.inheritedmineralrights.com/");
    expect(data.submitted_at).toBe("2026-06-02T18:30:00.000Z");

    // Notes carry the summary, recording, and call id.
    expect(data.notes).toContain("inherited minerals in Reeves County");
    expect(data.notes).toContain("https://bland.test/recording/abc123.mp3");
    expect(data.notes).toContain("call_abc123");

    expect(meta.callId).toBe("call_abc123");
    expect(meta.recordingUrl).toBe("https://bland.test/recording/abc123.mp3");
    expect(meta.priority).toBe("High"); // has an offer amount + sell intent
  });

  it("falls back to a Caller + phone name and Other intent when fields are sparse", () => {
    const { data, meta } = normalizeBlandCall({ c_id: "x9", from: "+14055559999" });
    expect(data.name).toBe("Caller +14055559999");
    expect(data.intent).toBe("Other");
    expect(meta.priority).toBe("Medium");
    expect(meta.callId).toBe("x9");
    // submitted_at defaults to a valid ISO timestamp.
    expect(() => new Date(data.submitted_at).toISOString()).not.toThrow();
  });

  it("derives High priority from a producing/royalty signal even without an offer", () => {
    const { meta } = normalizeBlandCall({
      from: "+14055550000",
      variables: { primary_intent: "question", producing_status: "producing" },
    });
    expect(meta.priority).toBe("High");
  });

  it("reads pathway_variables and prefers an explicit callback_phone", () => {
    const { data } = normalizeBlandCall({
      from: "+14055551111",
      pathway_variables: { callback_phone: "+14055552222", name: "Pat Owner" },
    });
    expect(data.phone).toBe("+14055552222");
    expect(data.name).toBe("Pat Owner");
  });

  it("tolerates a phone caller with no number at all", () => {
    const { data } = normalizeBlandCall({ summary: "anonymous call" });
    expect(data.name).toBe("Phone caller");
    expect(data.phone).toBeNull();
  });
});

describe("bland-call-lead handler", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.AIRTABLE_PAT;
    delete process.env.AIRTABLE_API_KEY;
    delete process.env.BLAND_WEBHOOK_SECRET;
  });

  it("posts to Slack and writes a Phone lead to Airtable", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response(JSON.stringify({ id: "rec123" }), { status: 200 })
        : new Response("ok", { status: 200 }),
    );

    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(BLAND_PAYLOAD));
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out).toMatchObject({ ok: true, form: "phone-lead", airtable: { configured: true, ok: true } });

    const slackCall = fetchMock.mock.calls.find((c) => String(c[0]).includes("hooks.slack.test"));
    expect(slackCall).toBeTruthy();
    const slackBody = JSON.parse(slackCall[1].body);
    expect(slackBody.text).toContain("New phone lead — Inherited Mineral Rights");
    expect(slackBody.text).toContain("+14055551234");
    expect(slackBody.text).toContain("call_abc123");

    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    const sent = JSON.parse(airtableCall[1].body);
    expect(sent.fields["Lead name"]).toBe("Jane Heir");
    expect(sent.fields.Source).toBe("Phone");
    expect(sent.fields.Priority).toBe("High");
    expect(sent.fields["Slack Posted"]).toBe("true");
    expect(sent.fields["UTM Campaign"]).toBe("inherited_minerals_phone");
  });

  it("ignores a sparse interim event without posting to Slack or Airtable", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(SPARSE_PAYLOAD));
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out).toMatchObject({ ok: true, ignored: true });
    expect(out.reason).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ignores an in-progress event even when it carries a collected variable", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(
      makeReq({ call_id: "ca-active", status: "in-progress", variables: { full_name: "Jim Payload" } }),
    );
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out).toMatchObject({ ok: true, ignored: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 405 for non-POST", async () => {
    const handler = await loadHandler();
    const res = await handler(
      new Request("https://site.test/.netlify/functions/bland-call-lead", { method: "GET" }),
    );
    expect(res.status).toBe(405);
  });

  it("returns 500 when Slack is not configured", async () => {
    vi.resetModules();
    delete process.env.SLACK_WEBHOOK_URL;
    const mod = await import("../functions/bland-call-lead.mjs");
    const res = await mod.default(makeReq(BLAND_PAYLOAD));
    expect(res.status).toBe(500);
    process.env.SLACK_WEBHOOK_URL = SLACK_URL;
  });

  it("Airtable failure does not break Slack success", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response("boom", { status: 500 })
        : new Response("ok", { status: 200 }),
    );
    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(BLAND_PAYLOAD));
    const out = await res.json();
    expect(res.status).toBe(200);
    expect(out.ok).toBe(true);
    expect(out.airtable).toMatchObject({ configured: true, ok: false });
  });

  it("returns 502 when Slack fails and never reaches Airtable", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response(JSON.stringify({ id: "x" }), { status: 200 })
        : new Response("slack down", { status: 500 }),
    );
    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(BLAND_PAYLOAD));
    expect(res.status).toBe(502);
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(airtableCall).toBeUndefined();
  });

  it("skips Airtable cleanly when no token is configured", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const handler = await loadHandler(); // no token
    const res = await handler(makeReq(BLAND_PAYLOAD));
    const out = await res.json();
    expect(out.airtable).toMatchObject({ configured: false, ok: false });
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(airtableCall).toBeUndefined();
  });

  it("accepts a urlencoded body", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
    const handler = await loadHandler();
    const body = new URLSearchParams({ call_id: "u1", from: "+14055558888", primary_intent: "value" }).toString();
    const res = await handler(
      makeReq(body, { headers: { "content-type": "application/x-www-form-urlencoded" } }),
    );
    expect(res.status).toBe(200);
    const slackCall = fetchMock.mock.calls.find((c) => String(c[0]).includes("hooks.slack.test"));
    expect(JSON.parse(slackCall[1].body).text).toContain("+14055558888");
  });

  describe("optional BLAND_WEBHOOK_SECRET", () => {
    it("rejects a request missing the secret", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
      const handler = await loadHandler({ BLAND_WEBHOOK_SECRET: "s3cret" });
      const res = await handler(makeReq(BLAND_PAYLOAD));
      expect(res.status).toBe(401);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("accepts the secret via the x-bland-secret header", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
      const handler = await loadHandler({ BLAND_WEBHOOK_SECRET: "s3cret" });
      const res = await handler(makeReq(BLAND_PAYLOAD, { headers: { "x-bland-secret": "s3cret" } }));
      expect(res.status).toBe(200);
    });

    it("accepts the secret via a query param", async () => {
      fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));
      const handler = await loadHandler({ BLAND_WEBHOOK_SECRET: "s3cret" });
      const res = await handler(
        makeReq(BLAND_PAYLOAD, {
          url: "https://site.test/.netlify/functions/bland-call-lead?secret=s3cret",
        }),
      );
      expect(res.status).toBe(200);
    });
  });
});
