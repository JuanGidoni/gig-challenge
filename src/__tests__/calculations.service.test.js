/**
 * @file calculations.service.test.js
 * @description Unit tests for the bet slip calculations service.
 */

import { describe, it, expect } from "vitest";
import {
  calculateTotal,
  calculatePotentialGain,
  validateAmount,
  MIN_AMOUNT,
  MAX_AMOUNT,
} from "../domain/bet-slip/calculations.service";

describe("calculateTotal", () => {
  it("returns the amount as-is (rounded)", () => {
    expect(calculateTotal(10)).toBe(10);
    expect(calculateTotal(5.555)).toBe(5.56);
  });
});

describe("calculatePotentialGain", () => {
  it("returns 0 when there are no selections", () => {
    expect(calculatePotentialGain([], 10)).toBe(0);
  });

  it("returns 0 when amount is 0", () => {
    const sel = [{ odd: 3.9 }];
    expect(calculatePotentialGain(sel, 0)).toBe(0);
  });

  it("multiplies a single odd by the amount", () => {
    const sel = [{ odd: 3.9 }];
    expect(calculatePotentialGain(sel, 1)).toBe(3.9);
  });

  it("multiplies all odds together then by amount (accumulator)", () => {
    const sels = [{ odd: 3.9 }, { odd: 1.68 }];
    // 3.9 × 1.68 × 1 = 6.552
    expect(calculatePotentialGain(sels, 1)).toBe(6.55);
  });

  it("rounds to 2 decimal places", () => {
    const sels = [{ odd: 1.111 }, { odd: 1.111 }];
    // 1.111 × 1.111 = 1.234321 → 1.23
    expect(calculatePotentialGain(sels, 1)).toBe(1.23);
  });
});

describe("validateAmount", () => {
  it("rejects empty input", () => {
    const r = validateAmount("");
    expect(r.valid).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("rejects non-numeric input", () => {
    const r = validateAmount("abc");
    expect(r.valid).toBe(false);
  });

  it("rejects values below minimum", () => {
    const r = validateAmount(String(MIN_AMOUNT - 0.01));
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/minimum/i);
  });

  it("rejects values above maximum", () => {
    const r = validateAmount(String(MAX_AMOUNT + 1));
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/maximum/i);
  });

  it("accepts a valid amount", () => {
    const r = validateAmount("50");
    expect(r.valid).toBe(true);
    expect(r.value).toBe(50);
    expect(r.error).toBeNull();
  });

  it("accepts decimal amounts", () => {
    const r = validateAmount("12.50");
    expect(r.valid).toBe(true);
    expect(r.value).toBe(12.5);
  });

  it("trims whitespace before validating", () => {
    const r = validateAmount("  25  ");
    expect(r.valid).toBe(true);
  });
});
