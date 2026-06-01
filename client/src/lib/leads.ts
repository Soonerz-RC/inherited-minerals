// Lead submission layer. Two interchangeable backends, selected at build time
// by VITE_LEAD_BACKEND (default "netlify-forms"):
//
//   - "netlify-forms": AJAX-style POST to "/" with a URL-encoded payload and a
//     `form-name` field, per Netlify's recommended pattern for SPA/React apps.
//     Submissions are captured by Netlify Forms and visible in the Netlify
//     dashboard. Requires a matching hidden static form in the built HTML so
//     Netlify's post-processing bot can register the form (see client/index.html).
//   - "api": POST JSON to the existing Netlify Functions (/api/review-requests,
//     /api/questions) — the future path to a database (Neon/Supabase).
//
// The Netlify Forms names are intentionally explicit and stable; if you rename
// them here, update client/index.html to match.

import { apiRequest } from "@/lib/queryClient";

export const REVIEW_FORM_NAME = "private-review-request";
export const QUESTION_FORM_NAME = "community-question";

type Backend = "netlify-forms" | "api";

const BACKEND: Backend =
  (import.meta.env.VITE_LEAD_BACKEND as Backend) === "api"
    ? "api"
    : "netlify-forms";

// Netlify Forms expects application/x-www-form-urlencoded with every value as a
// string. Arrays are joined; null/undefined become empty strings.
function encodeForm(data: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value == null) {
      params.append(key, "");
    } else if (Array.isArray(value)) {
      params.append(key, value.join(", "));
    } else {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

async function postToNetlifyForms(
  formName: string,
  data: Record<string, unknown>,
): Promise<void> {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm({ "form-name": formName, ...data }),
  });
  if (!res.ok) {
    throw new Error(
      "We couldn't submit your request just now. Please try again in a moment.",
    );
  }
}

/**
 * Submit the private review request. Routes to Netlify Forms by default, or to
 * the API function when VITE_LEAD_BACKEND=api.
 */
export async function submitReviewRequest(
  data: Record<string, unknown>,
): Promise<void> {
  if (BACKEND === "api") {
    await apiRequest("POST", "/api/review-requests", data);
    return;
  }
  await postToNetlifyForms(REVIEW_FORM_NAME, data);
}

/**
 * Submit a community question. Routes to Netlify Forms by default, or to the API
 * function when VITE_LEAD_BACKEND=api.
 */
export async function submitQuestion(
  data: Record<string, unknown>,
): Promise<void> {
  if (BACKEND === "api") {
    await apiRequest("POST", "/api/questions", data);
    return;
  }
  await postToNetlifyForms(QUESTION_FORM_NAME, data);
}
