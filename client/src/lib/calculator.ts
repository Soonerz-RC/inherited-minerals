// Transparent, conservative "rough range" estimator for inherited mineral
// rights. This is intentionally NOT an appraisal — it produces a wide starter
// range (or no range at all) plus a plain-English explanation, then hands the
// owner off to a private human review. All math is simple and explainable; we
// deliberately avoid oil-price / BOE modeling unless the owner gives us a
// royalty figure to anchor on.
//
// Pure and side-effect-free so it can be unit-tested and reused by the page.

export type ProducingStatus = "producing" | "not_producing" | "not_sure";
export type OwnerStatus = "self" | "estate_trust" | "co_owned" | "not_sure";

export interface CalculatorInput {
  state: string;
  county: string;
  /** Approximate net mineral acres. undefined = "not sure / left blank". */
  netAcres?: number;
  producingStatus: ProducingStatus;
  /** Average monthly royalty check, USD. undefined = unknown. */
  monthlyRoyalty?: number;
  /** Offer amount already received, USD. undefined = none. */
  offerAmount?: number;
  ownerStatus: OwnerStatus;
}

export type EstimateKind =
  // A rough numeric range was produced.
  | "range"
  // Not enough information to put numbers on it — review needed.
  | "review_needed";

export interface OfferComparison {
  // Where the offer falls relative to the rough range.
  position: "below" | "within" | "above";
  message: string;
}

export interface EstimateResult {
  kind: EstimateKind;
  /** Low/high USD bounds when kind === "range". */
  low?: number;
  high?: number;
  /** The basis used, for transparency in the UI. */
  basis:
    | "non_producing_per_acre"
    | "royalty_multiple"
    | "producing_per_acre"
    | "insufficient";
  /** Plain-English description of how the range was built. */
  method: string;
  /** Factors that could push value up. */
  increaseFactors: string[];
  /** Factors that could push value down. */
  decreaseFactors: string[];
  /** Gentle comparison when an offer was provided and a range exists. */
  offerComparison?: OfferComparison;
}

// --- Rough range constants (deliberately wide; "starter" figures only). ------
// Non-producing acreage, when acreage is known.
const NON_PRODUCING_PER_ACRE_LOW = 500;
const NON_PRODUCING_PER_ACRE_HIGH = 2000;
// Producing acreage when we have no royalty figure to anchor on (broad).
const PRODUCING_PER_ACRE_LOW = 2000;
const PRODUCING_PER_ACRE_HIGH = 8000;
// Royalty-income multiple (months of average monthly royalty) for producing
// minerals with a known check amount. Common rough-of-thumb band.
const ROYALTY_MULTIPLE_LOW = 36;
const ROYALTY_MULTIPLE_HIGH = 60;

/**
 * Coerce a possibly-messy currency/number string (e.g. "$1,250", " 40 ") to a
 * non-negative number, or undefined when blank/unparseable. Exported for tests.
 */
export function parseAmount(raw: string | number | undefined | null): number | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "number") return Number.isFinite(raw) && raw >= 0 ? raw : undefined;
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (cleaned === "") return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function buildOfferComparison(
  offer: number,
  low: number,
  high: number,
): OfferComparison {
  if (offer < low) {
    return {
      position: "below",
      message:
        "The offer you entered is below this rough range. That doesn't automatically mean it's a bad offer — but net acres, production, title, and lease terms all matter, so it's worth a closer look before deciding anything.",
    };
  }
  if (offer > high) {
    return {
      position: "above",
      message:
        "The offer you entered is above this rough range. A strong offer can be real — or it can reflect details this rough estimate can't see. It's worth understanding what's driving it before you decide.",
    };
  }
  return {
    position: "within",
    message:
      "The offer you entered falls within this rough range. That's a reasonable sign, but a rough range isn't an appraisal — title, net acres, production, and lease terms still need a proper look.",
  };
}

/** Shared "what moves this" factors, tailored by the inputs supplied. */
function factorsFor(input: CalculatorInput): {
  increase: string[];
  decrease: string[];
} {
  const increase: string[] = [];
  const decrease: string[] = [];

  if (input.producingStatus === "producing") {
    increase.push("Active, steady production and a healthy recent royalty history");
    increase.push("Location near new or expanding drilling activity");
  } else if (input.producingStatus === "not_producing") {
    increase.push("Nearby drilling, permits, or leasing interest in the area");
    decrease.push("No current production means no royalty income to value today");
  } else {
    decrease.push("Producing status is unknown — confirming it is the biggest single unlock");
  }

  if (input.monthlyRoyalty == null && input.producingStatus === "producing") {
    decrease.push("Without a royalty amount, the range stays very wide");
  }
  if (input.netAcres == null) {
    decrease.push("Net mineral acres are unknown — title and a deed review would tighten this a lot");
  }
  if (input.offerAmount != null) {
    increase.push("A written offer in hand can be a useful data point to compare against");
  }
  if (input.ownerStatus === "estate_trust" || input.ownerStatus === "not_sure") {
    decrease.push("Title may still need to be cleared through the estate before a sale can close");
  }
  if (input.ownerStatus === "co_owned") {
    decrease.push("Co-owned interests are valued on your fractional share, not the whole");
  }

  increase.push("Favorable lease terms and a higher royalty fraction");
  decrease.push("Declining production, lower commodity prices, or unfavorable lease terms");

  return { increase, decrease };
}

/**
 * Compute a rough estimate from the owner's inputs. Returns a wide range when
 * we have enough to anchor on, otherwise a "review needed" result that pushes
 * toward a human review rather than pretending precision.
 */
export function estimateValue(input: CalculatorInput): EstimateResult {
  const { increase, decrease } = factorsFor(input);
  const offer = input.offerAmount;

  // Not sure if producing → never pretend a number.
  if (input.producingStatus === "not_sure") {
    return {
      kind: "review_needed",
      basis: "insufficient",
      method:
        "Because it's not yet clear whether the minerals are producing, we can't put a meaningful range on them. Confirming producing status — and ideally net acres — is the first thing a review would sort out.",
      increaseFactors: increase,
      decreaseFactors: decrease,
    };
  }

  // Producing with a known monthly royalty → royalty-income multiple.
  if (input.producingStatus === "producing" && input.monthlyRoyalty != null) {
    const annualish = input.monthlyRoyalty;
    const low = Math.round(annualish * ROYALTY_MULTIPLE_LOW);
    const high = Math.round(annualish * ROYALTY_MULTIPLE_HIGH);
    return {
      kind: "range",
      low,
      high,
      basis: "royalty_multiple",
      method: `This rough range applies a ${ROYALTY_MULTIPLE_LOW}–${ROYALTY_MULTIPLE_HIGH}-month multiple to the average monthly royalty you entered. Producing minerals are often discussed as a multiple of recent royalty income, but the right multiple depends heavily on production decline, prices, and lease terms — so treat this as a starting point, not a quote.`,
      increaseFactors: increase,
      decreaseFactors: decrease,
      offerComparison: offer != null ? buildOfferComparison(offer, low, high) : undefined,
    };
  }

  // Producing but no royalty figure → broad per-acre range (needs acreage).
  if (input.producingStatus === "producing") {
    if (input.netAcres == null) {
      return {
        kind: "review_needed",
        basis: "insufficient",
        method:
          "These minerals are producing, but without either an average royalty check amount or your net mineral acres, any number would be a guess. A short review — or even one recent check stub — would let us frame a realistic range.",
        increaseFactors: increase,
        decreaseFactors: decrease,
      };
    }
    const low = Math.round(input.netAcres * PRODUCING_PER_ACRE_LOW);
    const high = Math.round(input.netAcres * PRODUCING_PER_ACRE_HIGH);
    return {
      kind: "range",
      low,
      high,
      basis: "producing_per_acre",
      method: `Because these minerals are producing but you didn't enter a royalty amount, this uses a very broad $${PRODUCING_PER_ACRE_LOW.toLocaleString()}–$${PRODUCING_PER_ACRE_HIGH.toLocaleString()} per net mineral acre band. That range is wide on purpose — actual royalty income would narrow it considerably.`,
      increaseFactors: increase,
      decreaseFactors: decrease,
      offerComparison: offer != null ? buildOfferComparison(offer, low, high) : undefined,
    };
  }

  // Non-producing with known acreage → per-acre starter range.
  if (input.producingStatus === "not_producing" && input.netAcres != null) {
    const low = Math.round(input.netAcres * NON_PRODUCING_PER_ACRE_LOW);
    const high = Math.round(input.netAcres * NON_PRODUCING_PER_ACRE_HIGH);
    return {
      kind: "range",
      low,
      high,
      basis: "non_producing_per_acre",
      method: `For non-producing acreage, this uses a starter $${NON_PRODUCING_PER_ACRE_LOW.toLocaleString()}–$${NON_PRODUCING_PER_ACRE_HIGH.toLocaleString()} per net mineral acre band. Non-producing minerals vary enormously — acreage near active drilling can be worth well above this, and remote acreage well below — so this is only a rough floor-to-ceiling sketch.`,
      increaseFactors: increase,
      decreaseFactors: decrease,
      offerComparison: offer != null ? buildOfferComparison(offer, low, high) : undefined,
    };
  }

  // Non-producing with unknown acreage → review needed.
  return {
    kind: "review_needed",
    basis: "insufficient",
    method:
      "Non-producing minerals can still hold real value from nearby drilling or future leasing, but without your net mineral acres we can't sketch a range. A review can help estimate your acreage from the deed and check what's happening around it.",
    increaseFactors: increase,
    decreaseFactors: decrease,
  };
}

/** Format a USD amount as a rounded, comma-grouped string, e.g. "$12,000". */
export function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
