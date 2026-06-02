// Learning Center content. All 10 starter articles plus index metadata live
// here as structured data so a single renderer (pages/LearnArticle.tsx) can
// present them consistently. Content is paraphrased plain-English education
// derived from the research brief; every external claim is backed by a cited
// source in the `sources` list. CTAs map to the three conversion routes:
//   - "review"  -> /sell        (Private Review)
//   - "offer"   -> /got-an-offer (Offer Review)
//   - "question"-> /ask         (Ask a Question)

export type CtaKind = "review" | "offer" | "question";

export interface CtaSpec {
  kind: CtaKind;
  text: string;
}

/** A single body block within an article section. */
export type Block =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "cta"; cta: CtaSpec };

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface Source {
  label: string;
  url: string;
}

export interface Article {
  slug: string; // path segment after /learn/
  category: string;
  keyword: string; // primary SEO keyword
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Short card/summary line for the index page. */
  summary: string;
  /** One-line reader-intent framing shown under the H1. */
  intro: string;
  readingMinutes: number;
  topCta: CtaSpec;
  sections: Section[];
  guardrails: string[]; // article-specific cautions surfaced to the reader
  sources: Source[];
  related: string[]; // slugs of related articles
}

export const CATEGORIES = [
  "Getting Oriented",
  "Probate & Title",
  "Documents",
  "Income & Payments",
  "Leasing",
  "Taxes",
  "Valuation & Selling",
  "Estate Planning",
  "Co-Ownership",
  "Recovering Money",
] as const;

export const LEARN_INTRO = {
  title: "The Inherited Minerals Learning Center",
  subhead:
    "Plain-English guides for people who inherited oil and gas mineral rights. Start with whatever question is keeping you up at night — what you own, how royalties work, whether an offer is fair — and work at your own pace. Nothing here is urgent, and understanding always comes before deciding.",
  metaTitle:
    "Learning Center — Inherited Mineral Rights Explained in Plain English",
  metaDescription:
    "Free, plain-English guides on inherited mineral rights: probate, deeds, royalty checks, division orders, leases, taxes, valuation, and selling. Educational only — not legal or tax advice.",
};

export const CTA_ROUTES: Record<CtaKind, string> = {
  review: "/sell",
  offer: "/got-an-offer",
  question: "/ask",
};

export const CTA_LABELS: Record<CtaKind, string> = {
  review: "Request a private review",
  offer: "Get an offer reviewed",
  question: "Ask a question",
};

export const articles: Article[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "what-are-inherited-mineral-rights",
    category: "Getting Oriented",
    keyword: "inherited mineral rights",
    title: "What Are Inherited Mineral Rights? A Plain-English Introduction",
    metaTitle:
      "What Are Inherited Mineral Rights? A Plain-English Introduction | Learning Center",
    metaDescription:
      "Inherited mineral rights explained for heirs: surface vs. mineral ownership, the types of interests you may hold, how royalties are paid, and the first documents to find.",
    summary:
      "You just learned you inherited mineral rights and have no idea what that means. Start here.",
    intro:
      "Most heirs have never heard the words “mineral rights” until a royalty check, a landman’s call, or a probate notice lands in their lap. This is the ground-zero explanation.",
    readingMinutes: 8,
    topCta: { kind: "review", text: "Inherited minerals and not sure what you own? We can help you get oriented." },
    sections: [
      {
        heading: "Surface Rights vs. Mineral Rights: Why They’re Often Two Separate Things",
        blocks: [
          {
            type: "p",
            text: "In the United States, the right to use the surface of a piece of land and the right to the oil, gas, and minerals beneath it can be owned by two completely different people. This is called a “split estate.” Generations ago, a landowner may have sold or kept the minerals separately from the farm or ranch above them. That is why you can inherit mineral rights without owning a single acre of visible ground.",
          },
          {
            type: "p",
            text: "For an heir, the practical takeaway is simple: owning minerals is its own kind of property ownership, with its own paperwork, its own income, and its own rules — separate from any house or land in the estate.",
          },
        ],
      },
      {
        heading: "What “Owning” Minerals Actually Means for an Heir",
        blocks: [
          {
            type: "p",
            text: "Owning minerals generally means you hold the right to the oil and gas (and sometimes other substances) under a described tract of land, and the right to lease that tract to a company that will explore for and produce those resources. In exchange, you may receive money — most commonly as a royalty, a share of the value of what is produced.",
          },
          {
            type: "p",
            text: "You usually do not have to do the drilling, pay for equipment, or manage a well to benefit. That is what makes a mineral or royalty interest different from actually operating a well.",
          },
        ],
      },
      {
        heading: "Types of Interests You May Have Inherited",
        blocks: [
          {
            type: "p",
            text: "“Mineral rights” is an umbrella term. The specific interest you inherited matters a great deal, because some carry costs and obligations while others do not:",
          },
          {
            type: "bullets",
            items: [
              "Mineral interest — the underlying ownership of the minerals, including the right to lease and to receive bonus and royalty payments.",
              "Royalty interest — the right to a share of production revenue, typically free of the costs of drilling and operating.",
              "Overriding royalty interest (ORRI) — a royalty carved out of a lease that usually ends when the lease ends.",
              "Working interest — an ownership stake in the actual operation of a well that comes with a share of the operating costs and liabilities.",
            ],
          },
          {
            type: "callout",
            title: "Why this distinction matters",
            text: "A working interest can require you to pay your share of operating expenses. Before you take any action, confirm in writing which type of interest you actually inherited — the answer changes both your income and your obligations.",
          },
        ],
      },
      {
        heading: "How Oil and Gas Companies Pay the People Who Own Minerals",
        blocks: [
          {
            type: "p",
            text: "When minerals are leased and a well produces, the operator typically pays mineral and royalty owners based on a “decimal interest” — a small number that reflects your share of the production from a well or unit. That decimal is multiplied by the value of production each month to calculate your check.",
          },
          {
            type: "p",
            text: "If nothing is currently produced from your acreage, you may own minerals that generate no income today but could be leased or developed later. Owning minerals does not guarantee a check.",
          },
        ],
      },
      {
        heading: "The First Three Documents Every Heir Should Try to Find",
        blocks: [
          {
            type: "bullets",
            items: [
              "A mineral deed or any conveyance showing how the minerals were owned and passed down.",
              "A recent royalty check stub or revenue statement, which tells you who is operating and roughly what is produced.",
              "Any oil and gas lease or division order, which describes the terms under which the minerals are being developed.",
            ],
          },
          {
            type: "p",
            text: "If you can’t find these, they are often recoverable: deeds are recorded at the county clerk’s office where the minerals sit, and operators can usually reissue recent statements.",
          },
          { type: "cta", cta: { kind: "review", text: "Inherited minerals and not sure what you own? Share what you have for a private, no-pressure review." } },
        ],
      },
      {
        heading: "What Your Next Steps Look Like (and Why There’s No Need to Rush)",
        blocks: [
          {
            type: "p",
            text: "The healthy order is: figure out what you own, confirm that ownership is recorded in your name, understand any income, and only then decide whether to hold, lease, or sell. A legitimate buyer or operator will give you time to do this. Inheritance decisions are rarely urgent.",
          },
          {
            type: "p",
            text: "From here, two good next reads are how minerals legally pass to heirs (probate) and how to read the deed that proves what you own.",
          },
        ],
      },
    ],
    guardrails: [
      "“Working interest” carries operating-cost obligations. Verify which interest type you inherited before taking any action.",
      "No interest type is universally “better” or “worse” — that depends entirely on your specific situation.",
    ],
    sources: [
      { label: "National Association of Royalty Owners (NARO) — FAQ on types of mineral interests", url: "https://www.naro-us.org/FAQ" },
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law course overview", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
      { label: "Oklahoma Corporation Commission — Basic Information for the Oklahoma Royalty Owner (PDF)", url: "https://oklahoma.gov/content/dam/ok/en/occ/documents/og/pubasst/Royalty-Owners-Booklet-112020.pdf" },
    ],
    related: ["probate-mineral-rights-heirs", "reading-mineral-deed-explained", "inherited-mineral-rights-tax-basics"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "probate-mineral-rights-heirs",
    category: "Probate & Title",
    keyword: "probate mineral rights",
    title: "Probate and Mineral Rights: What Heirs Need to Know Before Royalties Can Flow",
    metaTitle:
      "Probate and Mineral Rights for Heirs | Learning Center",
    metaDescription:
      "Why mineral rights usually require probate before royalties can flow to heirs, what documents operators require, when probate can be skipped, and the multi-state problem.",
    summary:
      "You inherited minerals but no checks are flowing — or you’ve been told to “go through probate.” Here’s what that means.",
    intro:
      "Mineral rights are real property, like a house, and in most states they can’t legally transfer to an heir without a formal process — usually probate.",
    readingMinutes: 9,
    topCta: { kind: "review", text: "Not sure if probate has been completed for your inherited minerals? Let’s figure out where you stand." },
    sections: [
      {
        heading: "Why Mineral Rights Don’t Automatically Transfer When Someone Dies",
        blocks: [
          {
            type: "p",
            text: "When a mineral owner dies, their interest doesn’t instantly become yours in the eyes of the law or the oil company. Mineral rights are real property, and title to real property generally has to move through a recognized legal process before a new owner is established in the public record.",
          },
          {
            type: "p",
            text: "Until that happens, an operator has no legally safe way to know it is paying the correct person — so it often holds the money rather than risk paying the wrong heir.",
          },
        ],
      },
      {
        heading: "What Probate Actually Is (and Isn’t)",
        blocks: [
          {
            type: "p",
            text: "Probate is the court-supervised process of settling a deceased person’s estate: validating any will, identifying heirs, paying debts and taxes, and formally transferring remaining property to the rightful people. It is not a punishment or a sign something went wrong — it’s simply the legal mechanism that produces documents the world can rely on.",
          },
          {
            type: "callout",
            title: "State by state",
            text: "Probate procedures, timelines, and costs differ substantially from state to state. There is no single national probate process, and anyone who tells you otherwise is oversimplifying.",
          },
        ],
      },
      {
        heading: "The Documents Oil Companies Require Before They’ll Pay a New Owner",
        blocks: [
          {
            type: "p",
            text: "Operators typically need proof that title has legally passed to you. Depending on the state and the estate, that can include letters testamentary or letters of administration, a recorded order distributing the estate, a death certificate, and a recorded deed or court order placing the minerals in your name.",
          },
          {
            type: "p",
            text: "In some states, an affidavit of heirship is accepted for certain situations — but it is not recognized everywhere, and not every operator will accept one. Treat it as one possible tool, not a guaranteed shortcut.",
          },
          { type: "cta", cta: { kind: "review", text: "Stuck partway through probate or unsure what the operator needs? Request a private review and we’ll help you map the path." } },
        ],
      },
      {
        heading: "When You Can Skip Probate: Trusts, Joint Tenancy, and Transfer-on-Death Deeds",
        blocks: [
          {
            type: "p",
            text: "Probate can sometimes be avoided when the minerals were already set up to pass outside of it:",
          },
          {
            type: "bullets",
            items: [
              "Revocable living trust — if the minerals were deeded into a trust, the successor trustee can usually transfer them under the trust’s terms.",
              "Joint tenancy with right of survivorship — the surviving owner may take the full interest automatically, though documentation is still required.",
              "Transfer-on-death (TOD) deed — available in some states, this names a beneficiary who receives the minerals at death without probate.",
            ],
          },
          {
            type: "p",
            text: "Whether any of these applies depends on the documents that were actually signed and recorded, and on the law of the state where the minerals are located.",
          },
        ],
      },
      {
        heading: "Multi-State Mineral Ownership: The Ancillary Probate Problem",
        blocks: [
          {
            type: "p",
            text: "Families often discover minerals in more than one state. Because each state controls title to property within its borders, you may need a separate “ancillary” probate in each state where minerals are located, in addition to the main probate where the person lived.",
          },
          {
            type: "p",
            text: "This is more common than people expect and is a major reason to take inventory early — so you’re not surprised by a second or third process later.",
          },
        ],
      },
      {
        heading: "Finding an Attorney and Knowing What Questions to Ask",
        blocks: [
          {
            type: "p",
            text: "Look for an attorney licensed in the state where the minerals are located, ideally one familiar with oil and gas title. Good opening questions: What process does this state require to transfer these minerals? Will an affidavit of heirship work, or do we need full probate? Are there minerals in other states we need to address? What will the operator need before it releases suspended payments?",
          },
          {
            type: "p",
            text: "Once title is clear, your next practical reads are how to read the deed that resulted and how to plan for passing these minerals on someday.",
          },
        ],
      },
    ],
    guardrails: [
      "Probate procedures, timelines, and requirements differ substantially by state — there is no single national process.",
      "An affidavit of heirship is accepted in some states but not others, and not by all operators. It is not a universal solution.",
      "Always consult a licensed attorney in the state where the minerals are located.",
    ],
    sources: [
      { label: "IRS Publication 559 — Survivors, Executors, and Administrators", url: "https://www.irs.gov/publications/p559" },
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
      { label: "Legal Information Institute (Cornell Law) — general legal reference", url: "https://www.law.cornell.edu" },
    ],
    related: ["reading-mineral-deed-explained", "transferring-mineral-rights-estate-planning", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "reading-mineral-deed-explained",
    category: "Documents",
    keyword: "mineral deed explained",
    title: "Reading a Mineral Deed: The Document That Proves You Own What You Think You Own",
    metaTitle: "Reading a Mineral Deed Explained | Learning Center",
    metaDescription:
      "A plain-English walkthrough of a mineral deed: grantor and grantee, the legal land description, undivided interest, warranty vs. quitclaim deeds, and where to find your deed.",
    summary:
      "You found or received a deed but can’t tell what it actually conveys. Learn to read the key parts.",
    intro:
      "A mineral deed is the birth certificate of mineral ownership — but it’s written for attorneys, not for families sorting out an inheritance.",
    readingMinutes: 8,
    topCta: { kind: "review", text: "Have a deed but not sure it transferred what you expected? Share it with us for a confidential review." },
    sections: [
      {
        heading: "Why the Deed Is the Starting Point for Every Mineral Ownership Question",
        blocks: [
          {
            type: "p",
            text: "Almost every question about minerals — what you own, whether you can lease, what you can sell — traces back to a deed. Deeds are recorded as public documents in the county where the minerals are located, which is why a title examiner starts there and works forward in time.",
          },
        ],
      },
      {
        heading: "Grantor, Grantee, and the Conveyance Language",
        blocks: [
          {
            type: "p",
            text: "The grantor is the person transferring the interest; the grantee is the person receiving it. The “granting clause” is the sentence that actually conveys ownership — language like “grants, sells, and conveys.” The exact words matter, because they define what is being transferred and any conditions attached.",
          },
        ],
      },
      {
        heading: "The Legal Description: Township, Range, Section",
        blocks: [
          {
            type: "p",
            text: "Mineral ownership is tied to a specific piece of ground. In much of the country that ground is described using the Public Land Survey System — section, township, and range — while other areas use metes-and-bounds surveys. This description, not a street address, is how your minerals are identified at the courthouse and by operators.",
          },
          {
            type: "callout",
            text: "The legal description is the key you’ll use to look up records, match royalty statements, and confirm you and the operator are talking about the same acreage.",
          },
        ],
      },
      {
        heading: "“Undivided Interest”: When Multiple People Own a Piece of the Same Minerals",
        blocks: [
          {
            type: "p",
            text: "It’s common for a deed to convey an “undivided” fractional interest — for example, an undivided 1/2 of the minerals in a tract. Undivided means you don’t own a specific physical corner of the ground; you own a percentage of the whole, alongside other co-owners. Inheritances frequently split minerals into smaller and smaller undivided fractions across a family.",
          },
        ],
      },
      {
        heading: "Warranty Deed vs. Quitclaim Deed — What the Difference Means for an Heir",
        blocks: [
          {
            type: "p",
            text: "A warranty deed includes promises from the grantor that they actually own what they’re conveying and will stand behind that title. A quitclaim deed transfers only whatever interest the grantor happens to have — with no promises. Receiving minerals by quitclaim isn’t necessarily a problem, but it tells you the title may deserve a closer look.",
          },
          { type: "cta", cta: { kind: "review", text: "Not sure whether your deed conveyed what you expected? Request a confidential review." } },
        ],
      },
      {
        heading: "Where to Find Your Deed if You Don’t Have a Copy",
        blocks: [
          {
            type: "p",
            text: "Recorded deeds live at the county clerk or recorder’s office where the minerals are located. Many counties offer online record search; others require a phone call or mailed request. Estate files, prior royalty statements, and the operator’s land department can also help you locate the right instrument.",
          },
          {
            type: "p",
            text: "Whether a particular deed is valid, defective, or sufficient is a legal question only a licensed attorney conducting a title examination can answer.",
          },
        ],
      },
    ],
    guardrails: [
      "This article does not assess whether any specific deed is valid, defective, or sufficient — only a licensed attorney conducting a title examination can make that determination.",
      "Deed language varies enormously by state and era. No sample wording is universal.",
    ],
    sources: [
      { label: "NARO — FAQ on mineral deeds and public records", url: "https://www.naro-us.org/FAQ" },
      { label: "Oklahoma Corporation Commission — Royalty Owner Booklet", url: "https://oklahoma.gov/content/dam/ok/en/occ/documents/og/pubasst/Royalty-Owners-Booklet-112020.pdf" },
      { label: "University of Oklahoma College of Law — Oil and Gas Title Examination: The Basics (PDF)", url: "https://digitalcommons.law.ou.edu/cgi/viewcontent.cgi?article=1003&context=onej" },
    ],
    related: ["probate-mineral-rights-heirs", "transferring-mineral-rights-estate-planning", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "royalty-check-explained",
    category: "Income & Payments",
    keyword: "royalty check oil gas",
    title: "Your First Royalty Check: What the Numbers Mean and How to Verify You’re Being Paid Correctly",
    metaTitle: "Your First Oil & Gas Royalty Check Explained | Learning Center",
    metaDescription:
      "Decode an oil and gas royalty revenue statement: decimal interest, gross vs. net royalty, post-production deductions, the basic verification math, and what to do when payments seem wrong.",
    summary:
      "That first royalty stub looks like a spreadsheet from another planet. Here’s how to read it line by line.",
    intro:
      "Gross revenue, deductions, decimal interest, BTU adjustment — none of it is intuitive. This guide translates a typical revenue statement into plain English.",
    readingMinutes: 9,
    topCta: { kind: "question", text: "Your royalty check raises questions? Ask us — we’re here to help you understand it." },
    sections: [
      {
        heading: "Anatomy of a Royalty Revenue Statement",
        blocks: [
          {
            type: "p",
            text: "A revenue statement usually shows, per well or per product: the production month, the product (oil, gas, or natural gas liquids), the volume produced, the price, your decimal interest, any deductions, and the net amount paid to you. The exact layout varies by operator, but those building blocks are almost always present.",
          },
        ],
      },
      {
        heading: "What Is a “Decimal Interest” and How Is It Calculated?",
        blocks: [
          {
            type: "p",
            text: "Your decimal interest is your share of production from a well or unit, expressed as a long decimal. Conceptually it combines your mineral ownership in the tract, the size of the tract relative to the producing unit, and your royalty rate from the lease.",
          },
          {
            type: "callout",
            title: "A simplified illustration",
            text: "If you owned all the minerals under a 40-acre tract, that tract were the entire 40-acre producing unit, and your lease royalty were 1/8 (0.125), your decimal would be 0.125. Real situations involve fractions of fractions, which is exactly why decimals get long — and why verifying them matters.",
          },
        ],
      },
      {
        heading: "Post-Production Deductions: Gathering, Transportation, and Processing",
        blocks: [
          {
            type: "p",
            text: "After gas leaves the wellhead it often must be gathered, compressed, transported, and processed before it can be sold. Some operators deduct a share of these “post-production” costs from royalty owners. Whether and how much they can deduct depends heavily on your lease language and the law of your state.",
          },
        ],
      },
      {
        heading: "Gross vs. Net Royalty: Why the Two Numbers Are Different",
        blocks: [
          {
            type: "p",
            text: "Gross royalty is your share of revenue before deductions and taxes; net royalty is what actually arrives after post-production costs and any severance taxes are subtracted. The gap between the two can be meaningful, and it’s worth understanding what’s being taken out.",
          },
        ],
      },
      {
        heading: "Verifying Your Payment Is Correct: The Basic Math",
        blocks: [
          {
            type: "p",
            text: "At its simplest, your gross share for a product line is volume × price × decimal interest. You can sanity-check a statement by confirming that number, then seeing how deductions and taxes bridge to the net you received. If your decimal suddenly changes, or volumes and prices look wrong, those are flags worth investigating.",
          },
          { type: "cta", cta: { kind: "question", text: "Numbers on your statement don’t add up? Ask us a question — no obligation." } },
        ],
      },
      {
        heading: "What to Do When Royalty Payments Stop, Are Late, or Seem Wrong",
        blocks: [
          {
            type: "p",
            text: "Payments can pause for ordinary reasons — title in suspense after a death, a sold lease, a minimum-payment threshold, or a missing W-9. Start by contacting the operator’s owner-relations or land department with your owner number. If something appears genuinely wrong with your decimal or deductions, an oil and gas attorney can help. Don’t simply refuse payments pending a dispute; get professional advice instead.",
          },
        ],
      },
    ],
    guardrails: [
      "Post-production deduction rules vary dramatically by state — no deduction is universally permissible or impermissible.",
      "Don’t refuse royalty payments while a dispute is pending; consult an oil and gas attorney.",
    ],
    sources: [
      { label: "IRS — Instructions for Schedule E (royalties and depletion)", url: "https://www.irs.gov/instructions/i1040se" },
      { label: "Oklahoma Corporation Commission — Royalty Owner Booklet (decimal interest examples)", url: "https://oklahoma.gov/content/dam/ok/en/occ/documents/og/pubasst/Royalty-Owners-Booklet-112020.pdf" },
      { label: "NARO — FAQ on division orders and operator contact", url: "https://www.naro-us.org/FAQ" },
      { label: "Graves Dougherty Hearon & Moody — “Division Orders: How Do I Know My Decimal Interest Is Right?”", url: "https://www.gdhm.com/news-post/division-orders-how-do-i-know-my-decimal-interest-is-right/" },
    ],
    related: ["division-orders-explained", "inherited-mineral-rights-tax-basics", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "division-orders-explained",
    category: "Documents",
    keyword: "division order mineral owner",
    title: "Division Orders: Why You Received This Document and What Happens If You Don’t Sign",
    metaTitle: "Division Orders Explained for Mineral Owners | Learning Center",
    metaDescription:
      "What an oil and gas division order is, what it asks you to agree to, the elements to check before signing, red-flag language, the W-9 and backup withholding, and when to get an attorney.",
    summary:
      "A division order arrived out of nowhere and wants your signature. Here’s what it is and what to check first.",
    intro:
      "A division order asks you to sign a legal document and may withhold your money until you do. This demystifies what it is and what to verify before signing.",
    readingMinutes: 8,
    topCta: { kind: "review", text: "Received a division order you’re not sure about? We can help you understand what you’re signing." },
    sections: [
      {
        heading: "What a Division Order Is and Why You Received One",
        blocks: [
          {
            type: "p",
            text: "A division order is essentially the operator’s statement of who gets paid and how much. It lists the well or unit, your name, and your decimal interest, and asks you to confirm that the ownership it shows is correct so the company can pay you. You typically receive one after a new well is completed or after ownership changes — including after an inheritance.",
          },
        ],
      },
      {
        heading: "What the Division Order Is Asking You to Agree To",
        blocks: [
          {
            type: "p",
            text: "At its core, a division order asks you to confirm your decimal interest and provide payment and tax information. A proper division order does not change the terms of your lease — it simply administers payment based on the ownership already established.",
          },
        ],
      },
      {
        heading: "The Critical Elements to Check Before You Sign",
        blocks: [
          {
            type: "bullets",
            items: [
              "Your name and ownership exactly as title shows it.",
              "The decimal interest — does it match what your deed and lease imply?",
              "The correct well, unit, and property description.",
              "The payor’s contact and owner number for future questions.",
              "How and when payments will be made, including any minimum threshold.",
            ],
          },
        ],
      },
      {
        heading: "Red Flags: Language That Can Alter Your Lease Rights",
        blocks: [
          {
            type: "p",
            text: "A division order should administer payment, not rewrite your lease. Be cautious if the document contains language that purports to ratify a unit you didn’t agree to, change your royalty rate, or amend lease terms. Anything that appears to modify your lease deserves attorney review before you sign.",
          },
          {
            type: "callout",
            title: "State rules differ",
            text: "Some states have historically required a signed division order before payment could issue; others have different rules and timelines. Don’t assume one universal rule applies to your situation.",
          },
          { type: "cta", cta: { kind: "review", text: "See unexpected language on your division order? Request a private review before you sign." } },
        ],
      },
      {
        heading: "The W-9 Form and Why It Matters for Backup Withholding",
        blocks: [
          {
            type: "p",
            text: "Operators generally need a completed IRS Form W-9 with your taxpayer identification number on file. Without it, they may be required to apply backup withholding, holding back a percentage of your payments and remitting it to the IRS. Providing an accurate W-9 helps ensure you’re paid in full and reported correctly.",
          },
        ],
      },
      {
        heading: "When to Have an Attorney Review the Division Order Before Signing",
        blocks: [
          {
            type: "p",
            text: "If the decimal doesn’t match your expectations, if the document contains lease-altering language, or if you simply don’t understand what you’re being asked to sign, have a qualified oil and gas attorney review it. This article can’t tell you whether to sign a specific document — only a licensed attorney can advise on your actual paperwork.",
          },
        ],
      },
    ],
    guardrails: [
      "Some states have required a signed division order before payment; others differ. There is no single universal rule.",
      "This article does not advise whether to sign or not sign a specific division order — only a licensed attorney can.",
      "A division order should not modify lease terms; any that appears to should receive attorney review.",
    ],
    sources: [
      { label: "Graves Dougherty Hearon & Moody — “Division Orders: How Do I Know My Decimal Interest Is Right?”", url: "https://www.gdhm.com/news-post/division-orders-how-do-i-know-my-decimal-interest-is-right/" },
      { label: "NARO — FAQ on division orders and recordkeeping", url: "https://www.naro-us.org/FAQ" },
      { label: "Oklahoma Corporation Commission — Royalty Owner Booklet (division order basics)", url: "https://oklahoma.gov/content/dam/ok/en/occ/documents/og/pubasst/Royalty-Owners-Booklet-112020.pdf" },
      { label: "Mineral Rights Podcast — “The Mineral Owner’s Guide to Division Orders”", url: "https://mineralrightspodcast.com/mrp-285-the-mineral-owners-guide-to-division-orders/" },
    ],
    related: ["royalty-check-explained", "oil-gas-lease-basics", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "oil-gas-lease-basics",
    category: "Leasing",
    keyword: "oil gas lease basics",
    title: "Understanding an Oil and Gas Lease: What You Give Up, What You Keep, and What to Negotiate",
    metaTitle: "Oil and Gas Lease Basics for Heirs | Learning Center",
    metaDescription:
      "An oil and gas lease in plain English: bonus vs. royalty, primary and secondary term, the royalty rate, pooling and unitization, and the protective clauses worth understanding before you sign.",
    summary:
      "A landman offered a bonus check and wants a signature. Understand what a lease actually does first.",
    intro:
      "Signing an oil and gas lease is one of the most consequential decisions a mineral owner makes — and one where heirs often feel the most pressure.",
    readingMinutes: 10,
    topCta: { kind: "review", text: "Been approached by a landman with a lease offer? Get a confidential review before you respond." },
    sections: [
      {
        heading: "What an Oil and Gas Lease Actually Does (and Doesn’t Do)",
        blocks: [
          {
            type: "p",
            text: "A lease gives an operator the right, for a period of time, to explore for and produce oil and gas from your minerals in exchange for payments to you. You generally keep ownership of the minerals; you’re granting the right to develop them. When the lease ends, those rights typically revert to you.",
          },
        ],
      },
      {
        heading: "Bonus Payment vs. Royalty: The Two Ways Heirs Get Paid",
        blocks: [
          {
            type: "p",
            text: "A bonus is an upfront, one-time payment for signing the lease, usually quoted per net mineral acre. A royalty is your ongoing share of production value if and when a well produces. Both matter, but over a productive well’s life the royalty rate is usually the more important number.",
          },
        ],
      },
      {
        heading: "Primary Term and Secondary Term: The Clock That Governs the Lease",
        blocks: [
          {
            type: "p",
            text: "The primary term is the window the operator has to begin production or drilling — often a few years. If production is established, the lease continues into its secondary term and stays alive “so long as” there is production (or other qualifying activity). If nothing happens during the primary term, the lease usually expires and rights return to you.",
          },
        ],
      },
      {
        heading: "The Royalty Rate: The Most Financially Important Term",
        blocks: [
          {
            type: "p",
            text: "The royalty rate sets your percentage share of production value. Historically rates clustered around 1/8 (12.5%), but rates vary widely by area, era, and negotiation. Because this number governs every future check, it deserves careful attention.",
          },
          {
            type: "callout",
            text: "Typical bonus and royalty figures vary enormously by geography and over time. Treat any number you hear as area- and date-specific, not as current market guidance.",
          },
          { type: "cta", cta: { kind: "review", text: "Want a second set of eyes on a lease offer? Request a private review." } },
        ],
      },
      {
        heading: "Pooling, Unitization, and Horizontal Wells",
        blocks: [
          {
            type: "p",
            text: "Modern horizontal wells often combine many tracts into a single drilling unit so one well can drain a large area. Pooling and unitization clauses describe how your acreage may be combined with neighbors’. This affects your decimal interest and how production is allocated to you, so it’s worth understanding how your lease handles it.",
          },
        ],
      },
      {
        heading: "Key Protective Clauses to Know (and Possibly Negotiate)",
        blocks: [
          {
            type: "bullets",
            items: [
              "Post-production cost clauses — whether the operator can deduct gathering, processing, and transportation from your royalty.",
              "Pugh clause — can release undeveloped acreage or deeper formations not actually produced.",
              "Shut-in royalty — payments that keep a lease alive when a well is capable of producing but temporarily shut in.",
              "Surface use and damages — relevant if you also own surface rights.",
              "Depth and Pugh limitations, plus assignment provisions.",
            ],
          },
          {
            type: "p",
            text: "What’s standard or negotiable varies by state, basin, and market. Have an oil and gas attorney review any lease before signing; this article can’t tell you to accept or reject a specific offer.",
          },
        ],
      },
    ],
    guardrails: [
      "Lease terms and what’s negotiable vary by state, basin, and market. No clause is guaranteed standard or negotiable everywhere.",
      "This article does not tell you to accept or reject a specific offer — consult an oil and gas attorney before signing.",
      "Typical bonus or royalty rates are not offered as current market guidance; they vary by geography and time.",
    ],
    sources: [
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law course", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
      { label: "NARO — FAQ on what an oil and gas lease is", url: "https://www.naro-us.org/FAQ" },
      { label: "Michigan Farm Bureau — Oil, Gas, and Mineral Leases overview", url: "https://www.michfb.com/agriculture/farming-resources/land-use-regulation/oil-gas-and-mineral-leases" },
      { label: "Texas A&M AgriLife — Petroleum Production on Agricultural Lands handbook", url: "https://agrilife.org/texasaglaw/2016/02/29/petroleum-production-on-agricultural-lands-in-texas-managing-risks-and-opportunities/" },
    ],
    related: ["division-orders-explained", "mineral-rights-valuation-basics", "royalty-check-explained"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "inherited-mineral-rights-tax-basics",
    category: "Taxes",
    keyword: "mineral rights taxes royalty income",
    title: "How Inherited Mineral Rights Are Taxed: Royalties, Depletion, and What the IRS Expects",
    metaTitle: "How Inherited Mineral Rights Are Taxed | Learning Center",
    metaDescription:
      "Federal tax basics for inherited minerals: royalty income on Schedule E, the depletion deduction, cost vs. percentage depletion, the step-up in basis, severance taxes, and common tax forms.",
    summary:
      "Royalty income is taxable — but it comes with deductions and a step-up in basis many heirs don’t know about.",
    intro:
      "This explains how royalty income flows onto a tax return, what depletion is, and why the step-up in basis is one of the most valuable tax features an heir has. Federal concepts only.",
    readingMinutes: 9,
    topCta: { kind: "question", text: "Questions about the tax side of your mineral inheritance? We’ll help you find the right professional." },
    sections: [
      {
        heading: "Royalty Income Is Ordinary Income — Here’s How It Gets Reported",
        blocks: [
          {
            type: "p",
            text: "For most individual mineral owners, oil and gas royalty income is reported on Schedule E of the federal Form 1040 as ordinary income. Operators typically send a Form 1099-MISC reporting the royalties they paid you during the year.",
          },
        ],
      },
      {
        heading: "What Is a Depletion Deduction and Who Can Take It?",
        blocks: [
          {
            type: "p",
            text: "Because producing minerals are a finite resource that is gradually used up, the tax code allows a depletion deduction that offsets part of your royalty income. Many mineral owners are unaware of it. Depletion is claimed in connection with the royalty income reported on Schedule E.",
          },
        ],
      },
      {
        heading: "Cost Depletion vs. Percentage Depletion",
        blocks: [
          {
            type: "p",
            text: "There are two methods. Cost depletion recovers your basis in the minerals over time as they’re produced. Percentage depletion allows a fixed percentage of gross income from the property, subject to limitations. Eligibility and rates can differ — for example, percentage depletion rules treat large integrated producers differently from independent producers — so don’t assume universal applicability. A CPA can determine which method applies to you.",
          },
          { type: "cta", cta: { kind: "question", text: "Not sure which depletion method fits your situation? Ask us and we’ll point you to the right professional." } },
        ],
      },
      {
        heading: "The Step-Up in Basis: Why Inheriting Is Often More Tax-Efficient Than Buying",
        blocks: [
          {
            type: "p",
            text: "When you inherit property, its tax “basis” is generally adjusted to its fair market value as of the date of death (a “step-up”). For minerals, that can substantially reduce the taxable gain if you later sell, because your gain is measured against the stepped-up value rather than what your relative originally paid. This is one of the most valuable features of inheriting rather than receiving a gift during life.",
          },
        ],
      },
      {
        heading: "Severance Taxes: The State-Level Tax Already Deducted from Your Check",
        blocks: [
          {
            type: "p",
            text: "Many states impose a severance tax on the extraction of oil and gas. It’s often withheld and shown on your revenue statement before you’re paid. Severance tax rules and rates vary by state. State income tax treatment of royalties also varies — this article addresses federal tax only, and state questions belong with a CPA.",
          },
        ],
      },
      {
        heading: "Common Tax Forms You’ll Encounter as a Mineral Owner",
        blocks: [
          {
            type: "bullets",
            items: [
              "Form 1099-MISC — reports royalties the operator paid you.",
              "Schedule E (Form 1040) — where royalty income and depletion are reported.",
              "Form 4562 — used in some cases for depreciation/depletion-related reporting.",
            ],
          },
          {
            type: "p",
            text: "Tax rules change, so confirm the current year’s requirements with a CPA. Nothing here calculates or projects your specific tax liability — that depends on your individual facts.",
          },
        ],
      },
    ],
    guardrails: [
      "Tax rules change. Confirm current rules with a CPA and note the applicable tax year.",
      "Percentage depletion eligibility and rates differ for large vs. independent producers — not universally applicable.",
      "State income tax treatment of royalties varies; this article covers federal tax only.",
      "This article does not calculate or project your specific tax liability.",
    ],
    sources: [
      { label: "IRS Publication 559 — Survivors, Executors, and Administrators (basis, depletion in respect of a decedent)", url: "https://www.irs.gov/publications/p559" },
      { label: "IRS — Instructions for Schedule E (royalty income and depletion)", url: "https://www.irs.gov/instructions/i1040se" },
      { label: "IRS Publication 544 — Sales and Other Dispositions of Property", url: "https://www.irs.gov/publications/p544" },
      { label: "IRS Fact Sheet FS-13-06 — Tips on Reporting Natural Resource Income (PDF)", url: "https://www.irs.gov/pub/irs-news/FS-13-06.pdf" },
      { label: "National Conference of State Legislatures — State Oil and Gas Severance Taxes", url: "https://www.ncsl.org/energy/state-oil-and-gas-severance-taxes" },
    ],
    related: ["mineral-rights-valuation-basics", "selling-inherited-mineral-rights", "royalty-check-explained"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "mineral-rights-valuation-basics",
    category: "Valuation & Selling",
    keyword: "mineral rights value",
    title: "What Are Your Mineral Rights Worth? How Valuation Works for an Inherited Interest",
    metaTitle: "Mineral Rights Valuation Basics | Learning Center",
    metaDescription:
      "How inherited mineral rights are valued: the income/DCF approach, comparable sales, the factors that drive value up or down, when a USPAP appraisal is required, and rules of thumb vs. real appraisals.",
    summary:
      "What are your minerals worth? Learn the main valuation approaches and what drives value up or down.",
    intro:
      "Inherited minerals are worth what a buyer will pay — but that number depends on factors you can look up and understand.",
    readingMinutes: 9,
    topCta: { kind: "offer", text: "Received an offer on your minerals? Understand what it’s based on before you decide." },
    sections: [
      {
        heading: "Why Mineral Rights Don’t Have a Simple Price Tag",
        blocks: [
          {
            type: "p",
            text: "Unlike a stock with a quoted price, every mineral interest is unique: different location, production history, lease terms, and development potential. Value depends on those specific facts, which is why no website — including this one — can tell you what your particular minerals are worth.",
          },
        ],
      },
      {
        heading: "The Income (Discounted Cash Flow) Approach",
        blocks: [
          {
            type: "p",
            text: "For producing minerals, buyers commonly project the future stream of royalty income, then discount it back to today’s dollars to reflect time and risk. Inputs include current production, expected decline over time, prices, and a discount rate. This is the workhorse method professional valuation firms use for producing royalty interests.",
          },
        ],
      },
      {
        heading: "The Comparable Sales Approach",
        blocks: [
          {
            type: "p",
            text: "Just as homes are compared to nearby sales, mineral interests can be benchmarked against what similar acreage in the same area recently sold for, often expressed per net mineral acre. Comparable data is most useful when the properties are genuinely similar.",
          },
        ],
      },
      {
        heading: "Key Factors That Drive Value Up or Down",
        blocks: [
          {
            type: "bullets",
            items: [
              "Whether the minerals are currently producing, and at what level.",
              "Location and the quality of the formation or basin.",
              "Your royalty rate and lease terms, including deductions.",
              "Commodity prices and overall market conditions.",
              "Undeveloped potential — acreage that could be drilled in the future.",
              "Title clarity and the size of the interest.",
            ],
          },
          { type: "cta", cta: { kind: "offer", text: "Have an offer in hand? Get it reviewed so you understand what it’s based on." } },
        ],
      },
      {
        heading: "When You Need a Formal Appraisal — and What That Means",
        blocks: [
          {
            type: "p",
            text: "For certain purposes — estate tax submissions, IRS matters, divorce, or litigation — you may need a formal, USPAP-compliant appraisal from a qualified, independent appraiser. A casual estimate or a buyer’s offer is not the same thing as that kind of appraisal.",
          },
        ],
      },
      {
        heading: "Rules of Thumb vs. Real Appraisals",
        blocks: [
          {
            type: "p",
            text: "You’ll hear rules of thumb such as a multiple of recent monthly royalty income. These can be rough orientation tools, but they are not reliable valuations — they ignore decline, lease terms, and your specific facts. For anything consequential, rely on a real appraisal rather than a shortcut. And no one can responsibly predict future commodity prices or production.",
          },
        ],
      },
    ],
    guardrails: [
      "Valuations are asset-specific and depend on facts a website can’t see. This site cannot provide a valuation.",
      "Rules of thumb (e.g., a multiple of monthly royalties) are rough orientation only, not reliable valuations.",
      "A formal USPAP-compliant appraisal from a qualified, independent appraiser is required for IRS estate tax submissions.",
      "No commodity-price predictions or implied future production levels.",
    ],
    sources: [
      { label: "Turrett Mineral Appraisals — Oil and Gas Appraisal: Basics for Mineral Owners", url: "https://www.turrett.com/primer-for-mineral-appraisals" },
      { label: "Mercer Capital — How to Value an Oil and Gas Mineral Royalty Interest", url: "https://mercercapital.com/insights/blogs/energy-valuation-insights-blog/2018/how-to-value-an-oil-and-gas-mineral-royalty-interest/" },
      { label: "IRS Publication 559 — valuation of inherited property for basis purposes", url: "https://www.irs.gov/publications/p559" },
      { label: "Enverus — Division Order and Mineral Interest glossary", url: "https://www.enverus.com/glossary/division-order/" },
    ],
    related: ["selling-inherited-mineral-rights", "inherited-mineral-rights-tax-basics", "oil-gas-lease-basics"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "selling-inherited-mineral-rights",
    category: "Valuation & Selling",
    keyword: "selling inherited mineral rights",
    title: "Selling Inherited Mineral Rights: The Step-by-Step Process and What to Watch Out For",
    metaTitle: "Selling Inherited Mineral Rights: Step by Step | Learning Center",
    metaDescription:
      "A plain-English guide to selling inherited minerals: confirming clear title, who buys and why, how offers are structured, getting multiple offers, the closing process, and the tax consequences.",
    summary:
      "Decided to sell, or seriously considering it? Understand the process, the players, and the risks first.",
    intro:
      "Selling minerals isn’t like selling a used car, but it’s not as complicated as it looks. Here’s the full process and the red flags to watch.",
    readingMinutes: 10,
    topCta: { kind: "offer", text: "Received an offer on your minerals? Let us review it with you before you sign." },
    sections: [
      {
        heading: "Before You Sell: Making Sure Your Title Is Clear",
        blocks: [
          {
            type: "p",
            text: "You can only sell what you can prove you own. Before engaging a buyer, confirm that title has legally passed to you — that probate or the appropriate transfer is complete and recorded. Unclear title is the most common thing that stalls or shrinks a sale.",
          },
        ],
      },
      {
        heading: "Who Buys Mineral Rights and Why (and What They’re Really Offering)",
        blocks: [
          {
            type: "p",
            text: "Buyers range from individuals and small funds to large mineral-acquisition companies. They’re generally betting that the future income or development potential is worth more than the lump sum they pay you today. Understanding that trade — certainty now versus potential income later — is central to deciding whether selling makes sense for you.",
          },
        ],
      },
      {
        heading: "How Offers Are Structured: Lump Sum, Price Per Acre, and Multiples",
        blocks: [
          {
            type: "p",
            text: "Offers are commonly expressed as a lump sum, a price per net mineral acre, or a multiple of recent monthly royalty income. Each framing can describe the same deal differently, so it helps to translate any offer into the others to compare apples to apples.",
          },
        ],
      },
      {
        heading: "Getting Multiple Offers and What “Market” Really Means",
        blocks: [
          {
            type: "p",
            text: "A single unsolicited offer tells you what one buyer will pay, not what your interest is worth. Soliciting multiple offers — and getting a professional opinion of value — is the best way to understand the real market for your specific interest. No one can responsibly call an offer “fair” or “unfair” without full information.",
          },
          { type: "cta", cta: { kind: "offer", text: "Want a second opinion before you sign? Get your offer reviewed — no obligation." } },
        ],
      },
      {
        heading: "The Closing Process: What Happens Between “Yes” and Getting Paid",
        blocks: [
          {
            type: "p",
            text: "After you accept, the buyer typically conducts due diligence on title and production, prepares a purchase and sale agreement and a mineral deed, and then closes — often with funds released once the deed is recorded. Read every document carefully and consider having an attorney review the deed and agreement before signing.",
          },
        ],
      },
      {
        heading: "Tax Consequences of Selling: Capital Gains, Basis, and the 1031 Option",
        blocks: [
          {
            type: "p",
            text: "Selling minerals is generally a taxable disposition. Your gain is measured against your basis — which, for inherited minerals, is often the stepped-up date-of-death value, potentially reducing the gain. A 1031 like-kind exchange may, in some circumstances, defer tax, but it is complex and time-sensitive, requiring a qualified intermediary and a tax advisor. Capital gains depend on holding period, basis, and your individual situation, so consult a CPA.",
          },
          {
            type: "callout",
            title: "Don’t decide in a vacuum",
            text: "This article doesn’t advise whether to sell or hold — that’s a personal financial decision that depends on your facts. Get multiple offers and professional review before deciding.",
          },
        ],
      },
    ],
    guardrails: [
      "A 1031 exchange is complex and time-sensitive; it requires a qualified intermediary and a tax advisor.",
      "This article does not advise whether to sell or hold — that depends on your individual facts.",
      "No offer is labeled “fair” or “unfair” without full information; get multiple offers and professional review.",
      "Capital gains depend on holding period, basis, and your situation — consult a CPA.",
    ],
    sources: [
      { label: "IRS Publication 544 — Sales and Other Dispositions of Property (capital gains)", url: "https://www.irs.gov/publications/p544" },
      { label: "IRS Publication 559 — step-up in basis for inherited property", url: "https://www.irs.gov/publications/p559" },
      { label: "Enverus — Mineral Interests: Guide for Buyers and Sellers", url: "https://www.enverus.com/industry-guides/the-guide-to-mineral-interests-what-every-buyer-and-seller-should-know/" },
      { label: "Turrett Mineral Appraisals — when to get a pre-sale appraisal", url: "https://www.turrett.com/primer-for-mineral-appraisals" },
      { label: "National Conference of State Legislatures — State Oil and Gas Severance Taxes", url: "https://www.ncsl.org/energy/state-oil-and-gas-severance-taxes" },
    ],
    related: ["inherited-mineral-rights-tax-basics", "mineral-rights-valuation-basics", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "transferring-mineral-rights-estate-planning",
    category: "Estate Planning",
    keyword: "transfer mineral rights estate planning",
    title: "Transferring Mineral Rights to Family: Deeds, Trusts, and Estate Planning Basics",
    metaTitle: "Transferring Mineral Rights & Estate Planning Basics | Learning Center",
    metaDescription:
      "Estate planning tools for mineral owners: mineral deeds, revocable living trusts, transfer-on-death deeds, LLCs, and joint tenancy — plus the carryover vs. step-up basis distinction.",
    summary:
      "Now that you understand what you inherited, how do you pass it on without a family fight?",
    intro:
      "Once you understand what you’ve inherited, the next question is often: how do I make sure my own kids don’t have to fight to get this?",
    readingMinutes: 9,
    topCta: { kind: "review", text: "Thinking about how to protect your mineral rights for the future? Let’s start the conversation." },
    sections: [
      {
        heading: "Why Mineral Rights Are Real Property — and Why That Matters",
        blocks: [
          {
            type: "p",
            text: "Because minerals are real property, transferring them generally requires the same kind of formality as transferring land: a properly drafted, signed, and recorded instrument, governed by the law of the state where the minerals are located. That’s the backdrop for every planning tool below.",
          },
        ],
      },
      {
        heading: "The Mineral Deed: The Core Document for Any Transfer",
        blocks: [
          {
            type: "p",
            text: "Whether you transfer minerals during life or at death, a deed is usually the instrument that actually moves ownership. Getting the legal description, the interest conveyed, and the recording right is essential — which is why drafting deeds is a job for a licensed attorney, not a template.",
          },
        ],
      },
      {
        heading: "Revocable Living Trusts: The Most Flexible Tool for Avoiding Probate",
        blocks: [
          {
            type: "p",
            text: "Deeding minerals into a revocable living trust can let them pass to your beneficiaries without probate, while you keep control during your lifetime. For owners with minerals in multiple states, a trust can also help avoid multiple ancillary probates. The catch is that the minerals must actually be deeded into the trust to get the benefit.",
          },
          { type: "cta", cta: { kind: "review", text: "Want help thinking through how to protect what you inherited? Request a private review." } },
        ],
      },
      {
        heading: "Transfer-on-Death Deeds and Beneficiary Designations: Where They Work",
        blocks: [
          {
            type: "p",
            text: "Some states allow transfer-on-death (TOD) deeds that name a beneficiary to receive the minerals at your death without probate. They can be simple and effective — but they are not available in every state, so availability depends entirely on where the minerals are located.",
          },
        ],
      },
      {
        heading: "LLCs for Mineral Owners: What They Do and What They Don’t Solve",
        blocks: [
          {
            type: "p",
            text: "Placing minerals in an LLC can help families manage co-owned interests, centralize decision-making, and transfer ownership by assigning membership interests rather than re-deeding minerals each time. An LLC is not a cure-all: formation, operating agreements, and tax treatment require state-specific legal and tax advice.",
          },
        ],
      },
      {
        heading: "The Estate Planning Conversation: Questions to Bring to Your Attorney",
        blocks: [
          {
            type: "p",
            text: "Helpful questions include: Which tool avoids probate in the states where my minerals sit? How do I keep co-owned minerals from fracturing across future generations? And how does basis work if I gift now versus passing at death?",
          },
          {
            type: "callout",
            title: "Carryover vs. step-up basis",
            text: "Gifting minerals during life generally passes your existing (carryover) basis to the recipient, while inheriting at death generally gives a stepped-up basis to date-of-death value. That distinction can have major tax consequences — note it, but bring it to a CPA for your situation.",
          },
        ],
      },
    ],
    guardrails: [
      "Transfer-on-death deeds are not available in all states. Availability depends on where the minerals are located.",
      "LLC formation and operating agreements for minerals require state-specific legal and tax advice.",
      "Carryover basis (lifetime gift) vs. step-up basis (inheritance at death) is critical — confirm application with a CPA.",
      "This article does not provide sample deed language; a licensed attorney should draft any conveyance.",
    ],
    sources: [
      { label: "IRS Publication 559 — basis rules for inherited and gifted property", url: "https://www.irs.gov/publications/p559" },
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law (ownership, co-tenancy, conveyance)", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
      { label: "Mineral Rights Podcast — Probate and Inherited Mineral Rights: Requirements and Alternatives", url: "https://mineralrightspodcast.com/mrp-311-probate-and-inherited-mineral-rights-requirements-and-alternatives/" },
      { label: "NARO — FAQ on mineral deeds and how they differ from leases", url: "https://www.naro-us.org/FAQ" },
    ],
    related: ["probate-mineral-rights-heirs", "reading-mineral-deed-explained", "what-are-inherited-mineral-rights"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "unclaimed-mineral-royalties-heirs",
    category: "Recovering Money",
    keyword: "unclaimed mineral royalties",
    title: "When No One Can Find the Heir: Unclaimed Royalties and How to Claim Money That’s Been Waiting for You",
    metaTitle: "Unclaimed Mineral Royalties for Heirs: How to Claim Them | Learning Center",
    metaDescription:
      "How heirs find and claim unclaimed or escheated oil and gas royalties: what happens when an owner can’t be found, where to search, the documentation states require, and getting back into pay status.",
    summary:
      "Royalty checks that went uncashed don’t disappear — they’re often held by the state. Here’s how to find and claim them.",
    intro:
      "When an oil company can’t locate a mineral owner who has died or moved, the royalty checks don’t vanish. After a waiting period, the operator turns the money over to the state, where it can sit for years — waiting for an heir who knows where to look.",
    readingMinutes: 9,
    topCta: { kind: "review", text: "Think there may be unclaimed royalties in your family’s name? Let’s help you find out." },
    sections: [
      {
        heading: "What Happens to Royalties When a Mineral Owner Dies and Isn’t Found",
        blocks: [
          {
            type: "p",
            text: "When an operator can’t confirm who should be paid — because the owner died, moved, changed their name, or never updated their address — it can’t safely keep cutting checks. Instead it places the money in “suspense,” holding it until the rightful owner (or their heir) comes forward with proof of ownership.",
          },
          {
            type: "p",
            text: "Suspended funds are common after a death, because the operator usually needs evidence that title has passed before it can pay a new person. The money is still yours to claim; it’s just parked until the paperwork catches up.",
          },
        ],
      },
      {
        heading: "Escheatment: How States Become the Temporary Custodian of Your Royalties",
        blocks: [
          {
            type: "p",
            text: "If suspended funds go unclaimed long enough — often one to five years depending on the state — the operator is legally required to hand them over to the state as “unclaimed property.” This handover is called escheatment. The state then becomes the custodian, holding the money (sometimes indefinitely) until an owner or heir claims it.",
          },
          {
            type: "callout",
            title: "Waiting periods vary",
            text: "The dormancy period before funds escheat, and the rules for claiming them, differ from state to state. There is no single national timeline.",
          },
        ],
      },
      {
        heading: "Where to Search: State Databases, MissingMoney.com, and the Delaware Angle",
        blocks: [
          {
            type: "p",
            text: "Start with the free, official tools. MissingMoney.com is a multi-state unclaimed-property search endorsed by state administrators, and Unclaimed.org (run by NAUPA) links to every state’s official unclaimed-property office. Search the deceased owner’s name, maiden names, prior addresses, and common misspellings.",
          },
          {
            type: "p",
            text: "Search every state where your family lived or owned minerals — not just your own. Many companies are incorporated in Delaware, and some unclaimed funds end up reported there, so it’s worth checking Delaware’s database even if your family never lived there.",
          },
          { type: "cta", cta: { kind: "review", text: "Found something in a database but not sure how to claim it as an heir? Request a private review." } },
        ],
      },
      {
        heading: "What Documentation You’ll Need to Claim as an Heir",
        blocks: [
          {
            type: "p",
            text: "Claiming in your own name is straightforward; claiming on behalf of a deceased relative is more involved. States typically want proof of the original owner’s identity and proof of your right to inherit — which can include a death certificate, a will or probate order, an affidavit of heirship, and identification.",
          },
          {
            type: "bullets",
            items: [
              "Proof linking the deceased owner to the unclaimed property (name, last known address, Social Security number where available).",
              "A death certificate for the original owner.",
              "Documents establishing your inheritance — a probate order, letters testamentary, or in some states an affidavit of heirship.",
              "Your own government-issued identification.",
            ],
          },
          {
            type: "callout",
            title: "Larger claims, more proof",
            text: "Some states require formal probate or court records for claims above a dollar threshold (Oklahoma, for example, has historically required more for claims over $10,000). Requirements vary, so confirm with the specific state office.",
          },
        ],
      },
      {
        heading: "After the Claim: Getting Back Into “Pay Status” With the Current Operator",
        blocks: [
          {
            type: "p",
            text: "Recovering escheated money is only half the job. Those funds are usually past royalties already turned over to the state — but the well may still be producing. To receive future checks, you also need to get back into “pay status” with the current operator by establishing your ownership directly with them, which typically means completing title transfer and a new division order.",
          },
        ],
      },
      {
        heading: "When Professional Help Makes Sense — and How to Avoid Overpaying for It",
        blocks: [
          {
            type: "p",
            text: "The official search and claim process is free, and for many heirs it’s entirely doable without help. Paid “finder” services exist, and some charge a large percentage of what they recover. Before signing with any finder, check whether you can claim the money yourself for free, and be cautious of contracts that take an outsized cut. If inheritance documentation is unclear or the amounts are significant, an attorney is often the better investment.",
          },
        ],
      },
    ],
    guardrails: [
      "State escheatment rules, waiting periods, and documentation requirements vary — there is no single universal process.",
      "Some states require probate or court records for claims above a threshold dollar amount (Oklahoma noted as an example for claims over $10,000).",
      "We don’t endorse any specific paid finder service; the official state search and claim process is free.",
      "Heirs claiming under a deceased owner’s name will almost always need proof of inheritance — consult an attorney if documentation is unclear or amounts are significant.",
    ],
    sources: [
      { label: "MissingMoney.com — national unclaimed property database (multi-state search)", url: "https://www.missingmoney.com" },
      { label: "Unclaimed.org (NAUPA) — links to all state unclaimed property offices", url: "https://www.unclaimed.org" },
      { label: "Mineral Rights Podcast — “How to Find Out if You Have Unclaimed Royalties”", url: "https://mineralrightspodcast.com/mrp-103-how-to-find-if-you-have-unclaimed-royalties/" },
      { label: "Blue Mesa Minerals — Finding Unclaimed Mineral Rights", url: "https://bluemesaminerals.com/finding-unclaimed-mineral-rights/" },
    ],
    related: ["probate-mineral-rights-heirs", "royalty-check-explained", "mineral-rights-heir-mistakes"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "co-tenancy-undivided-interest-mineral-rights",
    category: "Co-Ownership",
    keyword: "mineral rights undivided interest",
    title: "When You Inherit a Share, Not the Whole: Understanding Co-Tenancy and Undivided Interest",
    metaTitle: "Co-Tenancy & Undivided Mineral Interests for Heirs | Learning Center",
    metaDescription:
      "What it means to inherit an undivided fractional share of minerals with family: co-tenant rights, whether one owner can lease alone, accounting between co-owners, and partition as a last resort.",
    summary:
      "You own “a share” of minerals with siblings or cousins. Here’s what that actually gives you — and what happens when co-owners disagree.",
    intro:
      "Families rarely inherit minerals as a single block. More often, several relatives each inherit a fractional undivided interest — a percentage of the whole, not a separate piece of ground. That creates real practical questions.",
    readingMinutes: 9,
    topCta: { kind: "review", text: "Sharing inherited minerals with other family members and not sure how it works? Let’s sort through it together." },
    sections: [
      {
        heading: "What “Undivided Interest” Actually Means (and Doesn’t Mean)",
        blocks: [
          {
            type: "p",
            text: "An undivided interest means each co-owner owns a percentage of the entire mineral tract, not a marked-off corner of it. If three siblings each inherit an undivided one-third, none of them owns a specific acre — they each own a third of every acre. This is the normal result of minerals passing to multiple heirs, and it’s why inherited interests get split into smaller and smaller fractions over generations.",
          },
        ],
      },
      {
        heading: "The Rights Each Co-Tenant Has — Including the Ones That Might Surprise You",
        blocks: [
          {
            type: "p",
            text: "As a co-tenant, you generally have the right to your proportional share of income, the right to information about the property, and — in many states — the right to lease or develop your own interest without the others’ permission. You can usually also sell or transfer your own undivided share. What you typically cannot do is bind the other co-owners or sell their interests for them.",
          },
        ],
      },
      {
        heading: "Can One Sibling Sign an Oil and Gas Lease Without the Others?",
        blocks: [
          {
            type: "p",
            text: "In many states, yes — a co-tenant can lease their own undivided interest without the others’ consent, and the lessee acquires rights only in that co-tenant’s share. But the rules around development, and what the non-leasing co-owners are owed, differ significantly by state. Some states treat a non-consenting co-tenant as entitled to an accounting for their share of production, sometimes after costs. This is exactly the kind of question that turns on state law.",
          },
          {
            type: "callout",
            title: "State law governs",
            text: "Whether one co-tenant can act alone, and what the others are owed, varies substantially by state and is a question for an attorney familiar with that state’s law.",
          },
          { type: "cta", cta: { kind: "review", text: "One co-owner wants to lease and others don’t? Request a private review to understand your options." } },
        ],
      },
      {
        heading: "Accounting Between Co-Tenants: Who Gets Paid and How",
        blocks: [
          {
            type: "p",
            text: "When minerals produce, each co-owner is generally paid according to their fractional interest, reflected in their decimal interest on the division order. When one co-tenant develops or leases and others don’t, an “accounting” may determine how proceeds are shared — and whether the developing owner can recover certain costs first. How this works, again, depends on state law.",
          },
        ],
      },
      {
        heading: "Partition: The Legal Option When Co-Owners Can’t Agree",
        blocks: [
          {
            type: "p",
            text: "When co-owners reach an impasse, partition is the legal process that can divide the property — or, more often with minerals, force a sale and split the proceeds. Partition is a real right in many states, but it is expensive, slow, and hard on family relationships. It’s best understood as a last resort, not a routine tool, and it should be discussed with an attorney before anyone pursues it.",
          },
        ],
      },
      {
        heading: "Practical Strategies for Families Holding Minerals Together",
        blocks: [
          {
            type: "bullets",
            items: [
              "Keep a shared, current record of who owns what fraction and how to reach each owner.",
              "Agree in advance on how leasing or sale decisions will be discussed, even informally.",
              "Consider whether a family LLC or trust would simplify management and future transfers.",
              "Update ownership promptly when a co-owner dies, so interests don’t fragment unnoticed.",
            ],
          },
          {
            type: "p",
            text: "Holding minerals well as a family is mostly about communication and recordkeeping. We can’t mediate disputes between heirs — that belongs with legal counsel — but understanding how co-tenancy works is the first step to avoiding them.",
          },
        ],
      },
    ],
    guardrails: [
      "Co-tenancy law, partition rights, and accounting rules vary substantially by state — no rule here is universal.",
      "A co-tenant leasing without the others’ consent is allowed in many (not all) states, and the non-consenting owner’s accounting rights differ — treat this as state-specific and attorney-dependent.",
      "Partition is expensive, slow, and emotionally costly — a last resort, not a routine option.",
      "This site cannot help resolve a dispute between heirs; those questions belong with legal counsel.",
    ],
    sources: [
      { label: "University of Denver Law Review — “Mineral Leases by Tenants in Common”", url: "https://digitalcommons.du.edu/cgi/viewcontent.cgi?article=6688&context=dlr" },
      { label: "NARO — FAQ on co-ownership and mineral deeds", url: "https://www.naro-us.org/FAQ" },
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law (co-tenancy and co-tenant rights)", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
      { label: "Oklahoma Corporation Commission — Royalty Owner Booklet", url: "https://oklahoma.gov/content/dam/ok/en/occ/documents/og/pubasst/Royalty-Owners-Booklet-112020.pdf" },
    ],
    related: ["reading-mineral-deed-explained", "oil-gas-lease-basics", "transferring-mineral-rights-estate-planning"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "net-mineral-acres-net-royalty-acres",
    category: "Valuation & Selling",
    keyword: "net mineral acres explained",
    title: "Net Mineral Acres vs. Net Royalty Acres: The Two Numbers That Determine What an Offer Is Really Worth",
    metaTitle: "Net Mineral Acres vs. Net Royalty Acres Explained | Learning Center",
    metaDescription:
      "The difference between a net mineral acre (NMA) and a net royalty acre (NRA), the simple math that connects them, why royalty rate changes everything, and how to compare offers apples-to-apples.",
    summary:
      "When a buyer offers “$3,000 per acre,” per acre of what? The NMA vs. NRA distinction can change an offer’s real value dramatically.",
    intro:
      "The difference between a net mineral acre and a net royalty acre can change the real value of an offer by a wide margin — depending on the royalty rate in your lease. Here’s the arithmetic, in plain English.",
    readingMinutes: 8,
    topCta: { kind: "offer", text: "Received an offer and not sure how to evaluate it? Let us help you compare what you’re actually being offered." },
    sections: [
      {
        heading: "What a Net Mineral Acre (NMA) Is — and Why It’s Not Just “Acres”",
        blocks: [
          {
            type: "p",
            text: "A net mineral acre measures how much of the minerals you actually own beneath a tract. If a tract is 640 acres and you own an undivided one-half of the minerals, you own 320 net mineral acres. NMA is about ownership of the minerals themselves — independent of any lease or royalty rate.",
          },
        ],
      },
      {
        heading: "What a Net Royalty Acre (NRA) Is and Why Buyers Use It",
        blocks: [
          {
            type: "p",
            text: "A net royalty acre measures your share of the royalty income, normalized to a standard royalty rate. By convention, one net royalty acre equals the royalty from one net mineral acre leased at a 1/8 (12.5%) royalty. Buyers like NRA because it expresses the income side directly, making interests with different royalty rates comparable.",
          },
        ],
      },
      {
        heading: "The Math That Connects Them: Converting NMA to NRA",
        blocks: [
          {
            type: "p",
            text: "The conversion uses your actual lease royalty rate against the 1/8 baseline:",
          },
          {
            type: "callout",
            title: "The formula",
            text: "Net Royalty Acres = Net Mineral Acres × (your royalty rate ÷ 1/8). For example, 100 NMA leased at a 1/4 (25%) royalty equals 100 × (0.25 ÷ 0.125) = 200 NRA. The same 100 NMA leased at 1/8 equals exactly 100 NRA.",
          },
        ],
      },
      {
        heading: "Why Royalty Rate Is the Variable That Changes Everything",
        blocks: [
          {
            type: "p",
            text: "Because NRA scales with royalty rate, the same number of net mineral acres can be worth very different amounts depending on the lease. Minerals leased at a higher royalty produce more income per acre, so they convert to more net royalty acres — and a buyer paying “per NRA” is effectively paying for that higher income. This is why two offers that sound similar can be far apart in real value.",
          },
          { type: "cta", cta: { kind: "offer", text: "Two offers quoted differently and you can’t tell which is better? Get an offer review." } },
        ],
      },
      {
        heading: "How to Estimate How Many NMAs You Own When the Deed Isn’t Specific",
        blocks: [
          {
            type: "p",
            text: "Older deeds sometimes state a fraction without a clean acreage figure. You can estimate your NMA by multiplying the gross acres in the tract by your undivided mineral fraction. If the deed language is ambiguous, or the tract size is uncertain, this is where a landman or attorney can help — and where title disputes sometimes arise.",
          },
        ],
      },
      {
        heading: "Using NMA and NRA to Compare Offers on an Apples-to-Apples Basis",
        blocks: [
          {
            type: "p",
            text: "When you receive an offer, first pin down the unit: is it per net mineral acre or per net royalty acre? Then convert both offers to the same unit using your royalty rate. Only after they’re in the same terms can you tell which is genuinely higher. The unit matters as much as the number.",
          },
        ],
      },
    ],
    guardrails: [
      "NMA calculations can be contested in title disputes; if you’re unsure of your exact acreage, consult a landman or attorney.",
      "Current $/NMA and $/NRA market prices are highly local and time-sensitive — this article treats them as concepts only, not as price guidance.",
      "The 1/8 royalty baseline used in NRA math is a definitional convention, not a legal minimum; actual lease royalties vary.",
    ],
    sources: [
      { label: "NARO — Calculating Your Net Royalty Acres (formula and worked example)", url: "https://www.naro-us.org/blog/13134478" },
      { label: "Mineral Rights Podcast — NMA vs. NRA explained (worked conversions)", url: "https://mineralrightspodcast.com/what-is-the-difference-between-a-net-mineral-acre-nma-and-a-net-royalty-acrenra/" },
      { label: "Flat River Minerals — Net Mineral Acres vs. Net Royalty Acres", url: "https://flatriverminerals.com/resources/blog/net-mineral-acres-vs-net-royalty-acres/" },
      { label: "Oil and Gas Lawyer Blog — Net Royalty Acres Defined", url: "https://www.oilandgaslawyerblog.com/net-royalty-acres-defined/" },
    ],
    related: ["mineral-rights-valuation-basics", "selling-inherited-mineral-rights", "oil-gas-lease-basics"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "mineral-rights-heir-mistakes",
    category: "Getting Oriented",
    keyword: "mineral rights heir mistakes",
    title: "Five Mistakes Heirs Make With Inherited Mineral Rights (and How to Avoid Them)",
    metaTitle: "5 Mistakes Heirs Make With Inherited Mineral Rights | Learning Center",
    metaDescription:
      "The five most common and costly mistakes heirs make with inherited minerals — signing the first offer, missing the step-up basis, incomplete probate, ignoring suspended royalties, and not knowing the interest type — with what to do instead.",
    summary:
      "Most owners make their biggest mistakes in the first six months. Here are the five errors specific to heirs — and how to avoid each.",
    intro:
      "Heirs are especially vulnerable to costly errors: they’re dealing with grief, unfamiliar paperwork, and pushy buyers all at once. These are the five mistakes that hurt heirs most, with practical guidance on what to do instead.",
    readingMinutes: 9,
    topCta: { kind: "review", text: "Want a second set of eyes before you make any decisions? That’s exactly what we’re here for." },
    sections: [
      {
        heading: "Mistake #1: Signing the First Lease or Sale Offer That Arrives",
        blocks: [
          {
            type: "p",
            text: "An unsolicited offer tells you what one buyer or operator is willing to pay — not what your interest is worth. Heirs under time pressure sometimes sign the first thing they receive. The fix isn’t cynicism; it’s comparison. Get more than one opinion of value or more than one offer before you commit to anything.",
          },
          {
            type: "callout",
            title: "What to do instead",
            text: "Treat the first offer as information, not a deadline. Solicit additional offers or a professional opinion of value before deciding. A legitimate buyer will give you time.",
          },
        ],
      },
      {
        heading: "Mistake #2: Not Establishing Your Step-Up in Basis Before You Need It",
        blocks: [
          {
            type: "p",
            text: "When you inherit minerals, their tax basis is generally stepped up to fair market value as of the date of death. That stepped-up value can dramatically reduce your taxable gain if you ever sell — but only if you can document it. Heirs who never establish the date-of-death value can lose that benefit or scramble to reconstruct it years later.",
          },
          {
            type: "callout",
            title: "What to do instead",
            text: "Establish and document the date-of-death value early, ideally with a CPA or qualified appraiser. The step-up is a federal tax concept; state implications vary, so confirm application with a professional.",
          },
        ],
      },
      {
        heading: "Mistake #3: Assuming Probate Is “Done” When It Isn’t",
        blocks: [
          {
            type: "p",
            text: "Heirs often assume title transferred automatically, or that a probate in one state covered minerals in another. Incomplete probate is one of the most common reasons royalties stay suspended and sales stall. What counts as “complete” varies dramatically by state, and minerals in multiple states may need separate ancillary probates.",
          },
          {
            type: "callout",
            title: "What to do instead",
            text: "Confirm with an attorney that title has actually transferred and been recorded in every state where you own minerals — not just where your relative lived.",
          },
        ],
      },
      {
        heading: "Mistake #4: Overlooking Suspended or Unclaimed Royalties",
        blocks: [
          {
            type: "p",
            text: "Money owed to a deceased owner is frequently held in suspense by the operator, or turned over to the state as unclaimed property. Heirs who don’t go looking can leave years of royalties — sometimes substantial sums — unclaimed in state databases or in an operator’s suspense account.",
          },
          {
            type: "callout",
            title: "What to do instead",
            text: "Search the free official databases for your family’s names, and contact operators directly to check for suspended funds. Then make sure you’re set up to receive future checks.",
          },
        ],
      },
      {
        heading: "Mistake #5: Not Knowing Which Type of Interest You Actually Inherited",
        blocks: [
          {
            type: "p",
            text: "“Mineral rights” covers several different interests, and they don’t all behave the same way. A working interest, for example, can carry a share of operating costs and liabilities — very different from a cost-free royalty interest. Acting without knowing which you hold can lead to unexpected bills or bad decisions.",
          },
          {
            type: "callout",
            title: "What to do instead",
            text: "Confirm in writing which type of interest you inherited — mineral, royalty, overriding royalty, or working interest — before you lease, sell, or sign anything.",
          },
          { type: "cta", cta: { kind: "review", text: "Not sure you’ve avoided these traps? Request a private review before you decide anything." } },
        ],
      },
      {
        heading: "Building a Simple System to Manage Your Minerals Going Forward",
        blocks: [
          {
            type: "bullets",
            items: [
              "Keep a folder (paper or digital) with deeds, leases, division orders, and royalty statements.",
              "Record the date-of-death value and any appraisal for basis purposes.",
              "Track which operators pay you and keep your contact information current with them.",
              "Note where minerals are located by state, so probate and taxes are handled in the right places.",
            ],
          },
          {
            type: "p",
            text: "A little organization early prevents most of the expensive mistakes later. When in doubt, get a second opinion before acting.",
          },
        ],
      },
    ],
    guardrails: [
      "The step-up in basis is a federal tax concept; state-specific implications require a CPA.",
      "Not all first offers are unfair — the point is to get multiple opinions before deciding, not to assume every buyer is lowballing.",
      "“Incomplete” probate varies dramatically by state — what suffices in one state may not in another.",
    ],
    sources: [
      { label: "Mineral Rights Podcast — Common Mineral Owner Mistakes", url: "https://mineralrightspodcast.com/mrp-202-common-mineral-owner-mistakes/" },
      { label: "IRS Publication 559 — establishing basis of inherited property", url: "https://www.irs.gov/publications/p559" },
      { label: "Gold, Khourey & Turak — Understanding Mineral Rights for Heirs and New Owners", url: "https://www.gkt.com/understanding-mineral-rights-heirs/" },
      { label: "NARO — FAQ on documentation heirs need", url: "https://www.naro-us.org/FAQ" },
      { label: "Blue Mesa Minerals — Finding Unclaimed Mineral Rights", url: "https://bluemesaminerals.com/finding-unclaimed-mineral-rights/" },
    ],
    related: ["what-are-inherited-mineral-rights", "inherited-mineral-rights-tax-basics", "unclaimed-mineral-royalties-heirs"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "oil-gas-lease-clauses-explained",
    category: "Leasing",
    keyword: "oil gas lease clauses",
    title: "Key Oil and Gas Lease Clauses Every Heir Should Know Before Signing",
    metaTitle: "Key Oil & Gas Lease Clauses Explained for Heirs | Learning Center",
    metaDescription:
      "Six oil and gas lease clauses in plain English: habendum, Pugh, pooling and unitization, post-production deductions, shut-in royalty, and force majeure — enough vocabulary to talk to an attorney.",
    summary:
      "A lease may look like boilerplate, but a few default clauses can cost you money or lock up your acreage. Here are six worth understanding.",
    intro:
      "Many of a lease’s most important provisions are negotiable, and a few — left in their default form — can cost an heir money or tie up acreage longer than expected. This explains six key clauses in plain English. No legal advice; just enough vocabulary to talk to an attorney.",
    readingMinutes: 10,
    topCta: { kind: "review", text: "Have a draft lease with clauses you don’t understand? Let’s talk through what they mean before you sign." },
    sections: [
      {
        heading: "Why Lease Clauses Matter More Than the Bonus Check",
        blocks: [
          {
            type: "p",
            text: "The bonus is paid once; the clauses govern the relationship for years. A larger bonus can’t make up for a lease that deducts heavily from every royalty check or holds undeveloped acreage indefinitely. Understanding the clauses below is how you judge an offer beyond the headline number.",
          },
        ],
      },
      {
        heading: "The Habendum Clause: How Long Does the Lease Actually Last?",
        blocks: [
          {
            type: "p",
            text: "The habendum clause sets the lease’s duration in two parts: a fixed “primary term” (the window to begin drilling or production) and a “secondary term” that continues the lease “so long as” there is production or other qualifying activity. The wording of this clause determines whether a lease ends on schedule or continues indefinitely once a well produces.",
          },
        ],
      },
      {
        heading: "The Pugh Clause: Protecting Acreage That Isn’t in a Producing Unit",
        blocks: [
          {
            type: "p",
            text: "Without a Pugh clause, production from a small unit can hold your entire leased acreage — even parts never developed. A Pugh clause releases the undeveloped acreage (and sometimes deeper formations) back to you after the primary term, so the operator can’t keep idle acreage tied up indefinitely. The clause isn’t recognized or named the same way in every state.",
          },
          { type: "cta", cta: { kind: "review", text: "Want to understand how a clause affects your acreage? Request a private review before you sign." } },
        ],
      },
      {
        heading: "Pooling and Unitization: What Happens to Your Royalty When Wells Go Horizontal",
        blocks: [
          {
            type: "p",
            text: "Pooling and unitization clauses let the operator combine your tract with neighboring tracts into one drilling unit, which is how modern horizontal wells work. When that happens, you’re paid on your proportional share of the unit rather than the whole well. The clause’s terms — unit size limits, how allocation is calculated — affect your decimal interest, so they’re worth understanding.",
          },
        ],
      },
      {
        heading: "Post-Production Deduction Clauses: How Companies Reduce Your Royalty at the Back End",
        blocks: [
          {
            type: "p",
            text: "After production, gas often must be gathered, compressed, transported, and processed before sale. A post-production deduction clause governs whether the operator can subtract a share of those costs from your royalty. This is one of the most litigated areas of lease law, and the rules are heavily state-specific — a clause to understand and discuss with your attorney, not one with a single right answer.",
          },
        ],
      },
      {
        heading: "Shut-In Royalties and Force Majeure: The Clauses That Keep a Lease Alive Without Production",
        blocks: [
          {
            type: "p",
            text: "A shut-in royalty clause lets the operator keep a lease alive by paying a small fee when a well is capable of producing but temporarily shut in (for example, with no pipeline connection). A force majeure clause can suspend the operator’s obligations during events beyond its control. Both can extend a lease without active production, so it’s worth knowing how long and under what conditions they apply.",
          },
        ],
      },
    ],
    guardrails: [
      "The Pugh clause is not recognized or named the same way in all states; clause names and statutory versions vary by jurisdiction.",
      "Post-production deduction rules are heavily state-specific and frequently litigated — understand and discuss the clause with your attorney; it is not universally prohibited or permitted.",
      "Whether any specific clause should or shouldn’t be in a lease depends on the state, basin, and specific terms — this article doesn’t make that call.",
      "Always have a licensed oil and gas attorney review any draft lease before signing.",
    ],
    sources: [
      { label: "Texas Real Estate Research Center — Hints on Negotiating an Oil and Gas Lease", url: "https://trerc.tamu.edu/reports/hints-on-negotiating-an-oil-and-gas-lease/" },
      { label: "Texas A&M AgriLife — Petroleum Production on Agricultural Lands (lease clause breakdown)", url: "https://agrilife.org/texasaglaw/2016/02/29/petroleum-production-on-agricultural-lands-in-texas-managing-risks-and-opportunities/" },
      { label: "University of Oklahoma Law — Recent Developments in the Oil and Gas Habendum Clause", url: "https://digitalcommons.law.ou.edu/cgi/viewcontent.cgi?article=1366&context=onej" },
      { label: "Berlin Royalties — Oil and Gas Lease Clauses: The Pugh Clause", url: "https://www.berlinroyalties.com/sell-oklahoma-mineral-rights-the-oil-scout/oil-and-gas-lease-clauses-and-provisions-part-2-the-pugh-clause" },
      { label: "Texas A&M AgriLife Extension — Oil and Gas Law course", url: "https://agrilifeextension.tamu.edu/asset-external/oil-and-gas-law/" },
    ],
    related: ["oil-gas-lease-basics", "royalty-check-explained", "division-orders-explained"],
  },
];

export const articlesBySlug: Record<string, Article> = Object.fromEntries(
  articles.map((a) => [a.slug, a]),
);
