/**
 * @module domain/bet-slip/bet-slip.service
 * @description
 * Pure domain logic for managing the bet slip selections.
 *
 * RULES (as per product requirements):
 *  - The same selection (same eventId + choiceId) is toggled on/off.
 *  - Multiple choices from the same event CAN coexist (e.g. bet on "Turquie" AND "Pays-Bas").
 *
 * These functions are pure: they receive state and return new state.
 * No React, no side effects.
 */

/**
 * @typedef {import('../selection/selection.model').Selection} Selection
 */

/**
 * Checks whether a specific selection already exists in the bet slip.
 *
 * @param {Selection[]} selections - Current bet slip selections
 * @param {Selection}   candidate  - The selection to look up
 * @returns {boolean}
 */
export function hasSelection(selections, candidate) {
  return selections.some(
    (s) => s.eventId === candidate.eventId && s.choiceId === candidate.choiceId,
  );
}

/**
 * Toggles a selection: adds it if absent, removes it if already present.
 *
 * @param {Selection[]} selections - Current bet slip selections
 * @param {Selection}   selection  - Selection to toggle
 * @returns {Selection[]}          - Updated selections (new array reference)
 */
export function toggleSelection(selections, selection) {
  if (hasSelection(selections, selection)) {
    return removeSelection(selections, selection);
  }
  return [...selections, selection];
}

/**
 * Removes a selection from the bet slip unconditionally.
 *
 * @param {Selection[]} selections - Current bet slip selections
 * @param {Selection}   selection  - Selection to remove
 * @returns {Selection[]}          - Updated selections (new array reference)
 */
export function removeSelection(selections, selection) {
  return selections.filter(
    (s) =>
      !(s.eventId === selection.eventId && s.choiceId === selection.choiceId),
  );
}
