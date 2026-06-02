// Lightweight, self-contained knowledge index of the Learning Center, used by
// the assistant-chat function for RAG-lite grounding. Kept in sync (by hand)
// with client/src/lib/learn.ts — each entry mirrors a published article's slug,
// title and category, plus a short plain-English summary of the key points an
// heir would learn there. No imports, no build step, no internet calls.

export const SITE_URL = "https://www.inheritedmineralrights.com";

/** Build a public hash-route URL to an article. */
export function articleUrl(slug) {
  return `${SITE_URL}/#/learn/${slug}`;
}

// Conversion routes (mirror CTA_ROUTES in client/src/lib/learn.ts).
export const CTA_ROUTES = {
  review: "/sell",
  offer: "/got-an-offer",
  question: "/ask",
};

export const ARTICLES = [
  {
    slug: "what-are-inherited-mineral-rights",
    title: "What Are Inherited Mineral Rights? A Plain-English Introduction",
    category: "Getting Oriented",
    keywords: ["inherited mineral rights", "first steps", "where do i start", "surface", "split estate"],
    summary:
      "Surface rights and mineral rights can be owned separately (a 'split estate'), so you can inherit minerals without owning land. Owning minerals is its own property with its own paperwork, income and rules. The first move is to learn what type of interest you hold and find the original documents.",
  },
  {
    slug: "probate-mineral-rights-heirs",
    title: "Probate and Mineral Rights: How Inherited Minerals Pass to Heirs",
    category: "Probate & Title",
    keywords: ["probate", "estate", "will", "executor", "affidavit of heirship", "title", "transfer"],
    summary:
      "Minerals usually pass through probate or an estate process like other property. Before a company pays you, title must show you as owner — often via a probate order, affidavit of heirship, or recorded deed depending on the state. Gather the death certificate, any will, and the prior mineral deed so an attorney can confirm what the county requires.",
  },
  {
    slug: "reading-mineral-deed-explained",
    title: "How to Read a Mineral Deed: A Plain-English Walkthrough",
    category: "Documents",
    keywords: ["mineral deed", "documents", "legal description", "grantor", "grantee", "reservation"],
    summary:
      "A mineral deed records who conveyed what to whom, the legal description (section, township, range), and any reserved fractions. Reading it tells you what was actually transferred — all minerals or a fraction, and whether anything was held back. Recorded copies are kept by the county clerk where the minerals sit.",
  },
  {
    slug: "royalty-check-explained",
    title: "Your First Royalty Check, Explained",
    category: "Income & Payments",
    keywords: ["royalty", "check", "payment", "suspense", "stub", "decimal"],
    summary:
      "A royalty check is your share of revenue from produced oil or gas. After an ownership change, operators often hold payments in 'suspense' until updated title and a signed division order are on file. The check stub shows production, price and your decimal interest — keep stubs organized for taxes and valuation.",
  },
  {
    slug: "division-orders-explained",
    title: "Division Orders: What They Are and What to Check Before Signing",
    category: "Documents",
    keywords: ["division order", "decimal", "interest", "sign", "operator"],
    summary:
      "A division order states your decimal ownership interest and how you'll be paid. It is not the same as a deed and generally should not change what you own. Verify the decimal against your deed before signing, and be cautious of any clause that alters ownership rather than just confirming payment details.",
  },
  {
    slug: "oil-gas-lease-basics",
    title: "Oil & Gas Lease Basics for Inherited Minerals",
    category: "Leasing",
    keywords: ["lease", "bonus", "royalty fraction", "primary term", "operator", "drill", "pooling"],
    summary:
      "A lease gives an operator the right to drill and produce in exchange for a bonus and a royalty share. If you inherited leased minerals, existing terms usually carry over. Key terms: the royalty fraction, the primary term, and pooling/continuous-operations clauses.",
  },
  {
    slug: "inherited-mineral-rights-tax-basics",
    title: "Tax Basics for Inherited Mineral Rights and Royalty Income",
    category: "Taxes",
    keywords: ["tax", "irs", "1099", "depletion", "stepped-up basis", "capital gains", "income"],
    summary:
      "Royalty income is generally reportable, and inherited minerals often get a 'stepped-up basis' that affects capital gains if you later sell. Specifics vary a lot, so a CPA is genuinely valuable. Keep check stubs, 1099s and inheritance documents organized.",
  },
  {
    slug: "mineral-rights-valuation-basics",
    title: "How Mineral Rights Are Valued: A Plain-English Primer",
    category: "Valuation & Selling",
    keywords: ["value", "worth", "valuation", "appraisal", "how much", "estimate"],
    summary:
      "Value depends on whether acreage is producing, current and projected production, commodity prices, lease terms and location relative to active drilling. Two parcels in the same county can differ widely. Recent check stubs, the lease and an acreage description are the usual starting inputs. Treat any single offer as one data point, not 'the' value.",
  },
  {
    slug: "selling-inherited-mineral-rights",
    title: "Selling Inherited Mineral Rights: What to Know First",
    category: "Valuation & Selling",
    keywords: ["sell", "offer", "buyer", "should i sell", "lump sum", "fair"],
    summary:
      "Whether to sell is personal and depends on goals, taxes and the long-term outlook. If you consider an offer: understand what you own, compare more than one offer, and read exactly what's being conveyed (all minerals vs a fraction, surface, depths). A legitimate buyer gives you time to review — there's rarely a reason to sign quickly.",
  },
  {
    slug: "transferring-mineral-rights-estate-planning",
    title: "Transferring Mineral Rights: Estate Planning for Owners",
    category: "Estate Planning",
    keywords: ["estate planning", "transfer", "trust", "will", "heirs", "pass down"],
    summary:
      "Planning ahead — wills, trusts, or recorded transfers — keeps minerals from becoming a probate tangle for the next generation. Clear, recorded title now spares heirs the title-clearing work many inheritors face.",
  },
  {
    slug: "unclaimed-mineral-royalties-heirs",
    title: "Unclaimed Mineral Royalties: How Heirs Can Find Lost Money",
    category: "Recovering Money",
    keywords: ["unclaimed", "lost", "escheat", "suspense", "state treasury", "missing royalties"],
    summary:
      "When operators can't locate an owner, royalties can sit in suspense or be turned over to the state's unclaimed-property office. Heirs can search state unclaimed-property databases and operator suspense accounts; claiming usually requires proof of identity and the chain of inheritance.",
  },
  {
    slug: "co-tenancy-undivided-interest-mineral-rights",
    title: "Co-Ownership and Undivided Interests in Mineral Rights",
    category: "Co-Ownership",
    keywords: ["co-ownership", "undivided interest", "co-tenancy", "siblings", "fraction", "share"],
    summary:
      "Heirs often end up as co-tenants holding undivided fractional interests — each owns a share of the whole, not a specific piece of ground. Co-owners are generally paid their fraction and can lease or sell their own interest, though some decisions are easier with agreement among owners.",
  },
  {
    slug: "net-mineral-acres-net-royalty-acres",
    title: "Net Mineral Acres vs. Net Royalty Acres (NMA vs. NRA)",
    category: "Valuation & Selling",
    keywords: ["nma", "nra", "net mineral acres", "net royalty acres", "acreage", "fraction"],
    summary:
      "Net mineral acres (NMA) measure how much mineral acreage you own; net royalty acres (NRA) normalize that to a standard royalty so interests under different lease royalties can be compared. Buyers and appraisers often quote in NRA, so knowing the difference helps you compare offers apples-to-apples.",
  },
  {
    slug: "mineral-rights-heir-mistakes",
    title: "Common Mistakes Mineral Rights Heirs Make (and How to Avoid Them)",
    category: "Getting Oriented",
    keywords: ["mistakes", "pitfalls", "avoid", "scam", "pressure", "first steps"],
    summary:
      "Frequent missteps: signing a division order or offer before confirming ownership, treating one unsolicited offer as the true value, letting checks pile up instead of correcting title, and treating minerals in different states as one problem. Understanding before deciding avoids most of them.",
  },
  {
    slug: "oil-gas-lease-clauses-explained",
    title: "Oil & Gas Lease Clauses, Explained",
    category: "Leasing",
    keywords: ["lease clauses", "pooling", "shut-in", "royalty clause", "primary term", "habendum"],
    summary:
      "Lease clauses control how the deal really works: the royalty clause sets your share, the habendum/primary-term clause sets duration, pooling lets acreage be combined, and shut-in clauses keep a lease alive when wells aren't producing. Knowing these helps you read an inherited lease.",
  },
];

const STOPWORDS = new Set([
  "the", "and", "for", "are", "you", "your", "what", "how", "with", "that",
  "this", "have", "has", "from", "about", "can", "i", "a", "an", "to", "of",
  "is", "it", "do", "my", "me", "in", "on", "or", "we", "if", "be",
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Rank articles by simple keyword/term overlap with the query. Returns the top
 * `limit` matches as { slug, title, category, summary, url, score }. Always
 * returns something sensible even for an empty query (the orientation article).
 */
export function rankArticles(query, limit = 4) {
  const tokens = tokenize(query);
  const q = query.toLowerCase();
  const tokenSet = new Set(tokens);
  const scored = ARTICLES.map((a) => {
    let score = 0;
    const titleAndSummary = `${a.title} ${a.summary}`.toLowerCase();
    for (const kw of a.keywords) {
      // Phrase keywords present in the query are strong signals.
      if (kw.includes(" ") && q.includes(kw)) score += 3;
      // Single-word keywords matched as a whole query token are strong too.
      else if (!kw.includes(" ") && tokenSet.has(kw)) score += 2;
    }
    // Softer term overlap against the title/summary prose.
    for (const t of tokens) {
      if (titleAndSummary.includes(t)) score += 1;
    }
    return { article: a, score };
  });

  scored.sort((x, y) => y.score - x.score);
  const top = scored.filter((s) => s.score > 0).slice(0, limit);
  const chosen = top.length
    ? top
    : [{ article: ARTICLES[0], score: 0 }];

  return chosen.map(({ article, score }) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    summary: article.summary,
    url: articleUrl(article.slug),
    score,
  }));
}
