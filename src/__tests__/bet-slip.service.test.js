/**
 * @file bet-slip.service.test.js
 * @description Unit tests for the bet slip domain service.
 *
 * Tests are pure — no framework, no DOM, no React.
 * Run with: yarn test
 */

import { describe, it, expect } from "vitest";
import {
  toggleSelection,
  removeSelection,
  hasSelection,
} from "../domain/bet-slip/bet-slip.service";

/** @type {import('../domain/selection/selection.model').Selection} */
const selA = {
  eventId: 1,
  eventLabel: "Turquie / Pays-Bas",
  choiceId: 100,
  label: "Turquie",
  odd: 3.9,
  question: "Qui va gagner le match ?",
};

/** @type {import('../domain/selection/selection.model').Selection} */
const selB = {
  eventId: 1,
  eventLabel: "Turquie / Pays-Bas",
  choiceId: 101,
  label: "Pays-Bas",
  odd: 1.68,
  question: "Qui va gagner le match ?",
};

/** @type {import('../domain/selection/selection.model').Selection} */
const selC = {
  eventId: 2,
  eventLabel: "Getafe / Valencia",
  choiceId: 200,
  label: "Getafe",
  odd: 2.42,
  question: "Qui va gagner le match ?",
};

describe("hasSelection", () => {
  it("returns false for an empty slip", () => {
    expect(hasSelection([], selA)).toBe(false);
  });

  it("returns true when selection exists", () => {
    expect(hasSelection([selA], selA)).toBe(true);
  });

  it("returns false when only eventId matches", () => {
    expect(hasSelection([selA], selB)).toBe(false);
  });
});

describe("toggleSelection", () => {
  it("adds a new selection to an empty slip", () => {
    const result = toggleSelection([], selA);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(selA);
  });

  it("removes a selection that already exists (toggle off)", () => {
    const result = toggleSelection([selA], selA);
    expect(result).toHaveLength(0);
  });

  it("allows multiple choices from the same event", () => {
    const result = toggleSelection([selA], selB);
    expect(result).toHaveLength(2);
  });

  it("allows selections from different events", () => {
    const result = toggleSelection([selA], selC);
    expect(result).toHaveLength(2);
  });

  it("does not mutate the original array", () => {
    const original = [selA];
    toggleSelection(original, selB);
    expect(original).toHaveLength(1);
  });
});

describe("removeSelection", () => {
  it("removes the correct selection", () => {
    const result = removeSelection([selA, selB], selA);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(selB);
  });

  it("is a no-op when selection is not in the list", () => {
    const result = removeSelection([selA], selC);
    expect(result).toHaveLength(1);
  });

  it("does not mutate the original array", () => {
    const original = [selA, selB];
    removeSelection(original, selA);
    expect(original).toHaveLength(2);
  });
});
