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
];

export const articlesBySlug: Record<string, Article> = Object.fromEntries(
  articles.map((a) => [a.slug, a]),
);
