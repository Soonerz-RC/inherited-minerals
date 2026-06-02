import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const SLACK_URL = "https://hooks.slack.test/webhook";
const AIRTABLE_HOST = "api.airtable.com";

// Load the handler fresh with the desired env so module-load config (slackEnabled
// / airtableEnabled, both read at import time) reflects each scenario.
async function loadHandler(env = {}) {
  vi.resetModules();
  process.env.SLACK_WEBHOOK_URL = SLACK_URL;
  delete process.env.AIRTABLE_PAT;
  delete process.env.AIRTABLE_API_KEY;
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  const mod = await import("./form-to-slack.mjs");
  return mod.default;
}

function makeReq(body) {
  return new Request("https://site.test/.netlify/functions/form-to-slack", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const NETLIFY_SHAPE = {
  payload: {
    form_name: "private-review-request",
    data: { name: "Jane Heir", email: "jane@example.com", state: "Oklahoma", intent: "assistant" },
  },
};

describe("form-to-slack handler — Airtable backup", () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.AIRTABLE_PAT;
    delete process.env.AIRTABLE_API_KEY;
    delete process.env.AIRTABLE_BASE_ID;
    delete process.env.AIRTABLE_TABLE_ID;
  });

  it("writes to Airtable after a successful Slack post (Netlify webhook shape)", async () => {
    fetchMock.mockImplementation(async (url) => {
      if (String(url).includes(AIRTABLE_HOST)) {
        return new Response(JSON.stringify({ id: "rec123" }), { status: 200 });
      }
      return new Response("ok", { status: 200 });
    });

    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(NETLIFY_SHAPE));
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out).toMatchObject({ ok: true, airtable: { configured: true, ok: true } });

    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(airtableCall).toBeTruthy();
    const [url, opts] = airtableCall;
    expect(url).toContain("appTKXn43M25UPnYj");
    expect(url).toContain("tblj8AafSljpchWoK");
    expect(opts.headers.Authorization).toBe("Bearer pat_test_token");
    const sent = JSON.parse(opts.body);
    expect(sent.fields["Lead name"]).toBe("Jane Heir");
    expect(sent.fields.Email).toBe("jane@example.com");
    expect(sent.fields.Source).toBe("Assistant");
    expect(sent.fields["Slack Posted"]).toBe("true");
    expect(sent.fields.Status).toBe("New");
  });

  it("normalizes the direct JSON shape used in tests", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response(JSON.stringify({ id: "rec999" }), { status: 200 })
        : new Response("ok", { status: 200 }),
    );

    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(
      makeReq({ name: "Direct Lead", email: "direct@example.com", intent: "offer", state: "Texas" }),
    );
    const out = await res.json();
    expect(out.airtable.ok).toBe(true);
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    const sent = JSON.parse(airtableCall[1].body);
    expect(sent.fields["Lead name"]).toBe("Direct Lead");
    expect(sent.fields.State).toBe("Texas");
  });

  it("honors AIRTABLE_BASE_ID / AIRTABLE_TABLE_ID env overrides", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response(JSON.stringify({ id: "rec1" }), { status: 200 })
        : new Response("ok", { status: 200 }),
    );
    const handler = await loadHandler({
      AIRTABLE_API_KEY: "key_test",
      AIRTABLE_BASE_ID: "appCUSTOMBASE",
      AIRTABLE_TABLE_ID: "tblCUSTOM",
    });
    await handler(makeReq(NETLIFY_SHAPE));
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(String(airtableCall[0])).toContain("appCUSTOMBASE");
    expect(String(airtableCall[0])).toContain("tblCUSTOM");
    expect(airtableCall[1].headers.Authorization).toBe("Bearer key_test");
  });

  it("Airtable failure does not break Slack success", async () => {
    fetchMock.mockImplementation(async (url) => {
      if (String(url).includes(AIRTABLE_HOST)) {
        return new Response("Airtable boom", { status: 500 });
      }
      return new Response("ok", { status: 200 });
    });

    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(NETLIFY_SHAPE));
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out.ok).toBe(true);
    expect(out.airtable).toMatchObject({ configured: true, ok: false });
  });

  it("reports configured:false and skips Airtable when no token is set", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const handler = await loadHandler(); // no AIRTABLE_* token
    const res = await handler(makeReq(NETLIFY_SHAPE));
    const out = await res.json();

    expect(res.status).toBe(200);
    expect(out.ok).toBe(true);
    expect(out.airtable).toMatchObject({ configured: false, ok: false });
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(airtableCall).toBeUndefined();
  });

  it("still returns 502 (and never reaches Airtable) when Slack fails", async () => {
    fetchMock.mockImplementation(async (url) =>
      String(url).includes(AIRTABLE_HOST)
        ? new Response(JSON.stringify({ id: "x" }), { status: 200 })
        : new Response("slack down", { status: 500 }),
    );

    const handler = await loadHandler({ AIRTABLE_PAT: "pat_test_token" });
    const res = await handler(makeReq(NETLIFY_SHAPE));

    expect(res.status).toBe(502);
    const airtableCall = fetchMock.mock.calls.find((c) => String(c[0]).includes(AIRTABLE_HOST));
    expect(airtableCall).toBeUndefined();
  });
});
