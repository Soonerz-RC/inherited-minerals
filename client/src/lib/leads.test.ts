import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { submitAssistantLead, REVIEW_FORM_NAME } from "@/lib/leads";

describe("submitAssistantLead", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  const payload = {
    name: "Perplexity QA Assistant Fixed Handoff Test",
    email: "g.knight@oklahomaminerals.com",
    state: "Oklahoma",
    intent: "assistant",
    notes: "— Assistant intake —\nGoal: Explore selling",
    source_page: "/ask",
  };

  it("POSTs to the live form-to-slack function in the Netlify-notification shape", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await submitAssistantLead(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("/.netlify/functions/form-to-slack");
    expect(opts.method).toBe("POST");
    const body = JSON.parse(opts.body as string);
    expect(body.payload.form_name).toBe(REVIEW_FORM_NAME);
    expect(body.payload.form_name).toBe("private-review-request");
    expect(body.payload.data.intent).toBe("assistant");
    expect(body.payload.data.email).toBe(payload.email);
    expect(body.payload.data.notes).toContain("Assistant intake");
  });

  it("throws (no false success) when the endpoint returns a non-2xx", async () => {
    fetchMock.mockResolvedValue(new Response("err", { status: 502 }));
    await expect(submitAssistantLead(payload)).rejects.toThrow(/couldn't send your summary/i);
  });
});
