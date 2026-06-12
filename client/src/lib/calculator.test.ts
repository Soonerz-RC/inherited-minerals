import { describe, it, expect } from "vitest";
import {
  estimateValue,
  parseAmount,
  formatUsd,
  type CalculatorInput,
} from "@/lib/calculator";

const base: CalculatorInput = {
  state: "Oklahoma",
  county: "Canadian",
  producingStatus: "not_sure",
  ownerStatus: "not_sure",
};

describe("parseAmount", () => {
  it("strips currency formatting", () => {
    expect(parseAmount("$1,250")).toBe(1250);
    expect(parseAmount(" 40 ")).toBe(40);
    expect(parseAmount("$2,000.50")).toBeCloseTo(2000.5);
  });
  it("returns undefined for blank or unparseable input", () => {
    expect(parseAmount("")).toBeUndefined();
    expect(parseAmount("   ")).toBeUndefined();
    expect(parseAmount("abc")).toBeUndefined();
    expect(parseAmount(null)).toBeUndefined();
    expect(parseAmount(undefined)).toBeUndefined();
  });
  it("rejects negative numbers", () => {
    expect(parseAmount(-5)).toBeUndefined();
  });
  it("accepts plain numbers", () => {
    expect(parseAmount(120)).toBe(120);
  });
});

describe("estimateValue — review needed paths", () => {
  it("returns review_needed when producing status is not sure", () => {
    const r = estimateValue({ ...base, producingStatus: "not_sure", netAcres: 40 });
    expect(r.kind).toBe("review_needed");
    expect(r.basis).toBe("insufficient");
    expect(r.low).toBeUndefined();
  });

  it("returns review_needed when producing but no royalty and no acreage", () => {
    const r = estimateValue({ ...base, producingStatus: "producing" });
    expect(r.kind).toBe("review_needed");
  });

  it("returns review_needed when non-producing and acreage unknown", () => {
    const r = estimateValue({ ...base, producingStatus: "not_producing" });
    expect(r.kind).toBe("review_needed");
  });
});

describe("estimateValue — non-producing per acre", () => {
  it("uses the $500–$2,000 per acre starter band", () => {
    const r = estimateValue({ ...base, producingStatus: "not_producing", netAcres: 10 });
    expect(r.kind).toBe("range");
    expect(r.basis).toBe("non_producing_per_acre");
    expect(r.low).toBe(5000);
    expect(r.high).toBe(20000);
  });
});

describe("estimateValue — producing per acre (no royalty)", () => {
  it("uses the broad $2,000–$8,000 per acre band", () => {
    const r = estimateValue({ ...base, producingStatus: "producing", netAcres: 5 });
    expect(r.kind).toBe("range");
    expect(r.basis).toBe("producing_per_acre");
    expect(r.low).toBe(10000);
    expect(r.high).toBe(40000);
  });
});

describe("estimateValue — royalty multiple", () => {
  it("applies a 36–60 month multiple to monthly royalty", () => {
    const r = estimateValue({
      ...base,
      producingStatus: "producing",
      monthlyRoyalty: 100,
    });
    expect(r.kind).toBe("range");
    expect(r.basis).toBe("royalty_multiple");
    expect(r.low).toBe(3600);
    expect(r.high).toBe(6000);
  });

  it("prefers royalty multiple over per-acre when both are present", () => {
    const r = estimateValue({
      ...base,
      producingStatus: "producing",
      monthlyRoyalty: 100,
      netAcres: 80,
    });
    expect(r.basis).toBe("royalty_multiple");
  });
});

describe("estimateValue — offer comparison", () => {
  const producing = {
    ...base,
    producingStatus: "producing" as const,
    monthlyRoyalty: 100,
  }; // range 3600–6000

  it("flags an offer below the range", () => {
    const r = estimateValue({ ...producing, offerAmount: 1000 });
    expect(r.offerComparison?.position).toBe("below");
  });
  it("flags an offer within the range", () => {
    const r = estimateValue({ ...producing, offerAmount: 5000 });
    expect(r.offerComparison?.position).toBe("within");
  });
  it("flags an offer above the range", () => {
    const r = estimateValue({ ...producing, offerAmount: 99999 });
    expect(r.offerComparison?.position).toBe("above");
  });
  it("never says accept or reject", () => {
    const r = estimateValue({ ...producing, offerAmount: 1000 });
    expect(r.offerComparison?.message.toLowerCase()).not.toMatch(/\b(accept|reject|take it|walk away)\b/);
  });
  it("omits comparison when no offer given", () => {
    const r = estimateValue(producing);
    expect(r.offerComparison).toBeUndefined();
  });
  it("omits comparison on review_needed results even if an offer is given", () => {
    const r = estimateValue({ ...base, producingStatus: "not_sure", offerAmount: 5000 });
    expect(r.offerComparison).toBeUndefined();
  });
});

describe("estimateValue — factors", () => {
  it("always returns at least one up and one down factor", () => {
    const r = estimateValue({ ...base, producingStatus: "not_producing", netAcres: 10 });
    expect(r.increaseFactors.length).toBeGreaterThan(0);
    expect(r.decreaseFactors.length).toBeGreaterThan(0);
  });
  it("notes unknown acreage as a downward/uncertainty factor", () => {
    const r = estimateValue({ ...base, producingStatus: "producing", monthlyRoyalty: 100 });
    expect(r.decreaseFactors.join(" ")).toMatch(/net mineral acres are unknown/i);
  });
});

describe("formatUsd", () => {
  it("formats with comma grouping and a dollar sign", () => {
    expect(formatUsd(12000)).toBe("$12,000");
    expect(formatUsd(3600.7)).toBe("$3,601");
  });
});
