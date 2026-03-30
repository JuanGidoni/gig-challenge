/**
 * @file date.utils.test.js
 * @description Unit tests for shared date formatting utilities.
 */

import { describe, it, expect } from "vitest";
import { formatEventDate } from "../domain/shared/date.utils";

describe("formatEventDate", () => {
  it("returns 'TBC' for null input", () => {
    expect(formatEventDate(null)).toBe("TBC");
  });

  it("returns 'TBC' for an invalid Date", () => {
    expect(formatEventDate(new Date("not-a-date"))).toBe("TBC");
  });

  it("returns 'TBC' for non-Date input", () => {
    expect(formatEventDate("2021-03-24")).toBe("TBC");
  });

  it("formats a valid date with day, month and time", () => {
    // Use UTC to avoid timezone flakiness in CI
    const date = new Date("2021-03-24T19:45:00.000Z");
    const result = formatEventDate(date);
    // Should contain a month name and time-like pattern
    expect(result).toMatch(/march/i);
    expect(result).toMatch(/:/);
  });
});
