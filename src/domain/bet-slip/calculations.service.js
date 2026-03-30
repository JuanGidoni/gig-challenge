/**
 * @module domain/bet-slip/calculations.service
 * @description
 * Pure domain calculations for a bet slip.
 *
 * All functions are deterministic and side-effect free.
 * Rounding to 2 decimal places is done at this layer so the UI
 * never has to worry about floating-point artefacts.
 */

/**
 * @typedef {import('../selection/selection.model').Selection} Selection
 */

/** Minimum allowed stake amount (in euros). */
export const MIN_AMOUNT = 1;

/** Maximum allowed stake amount (in euros). */
export const MAX_AMOUNT = 10_000;

/**
 * Calculates the total stake to pay.
 *
 * Currently a simple pass-through (single-bet model).
 * This abstraction allows future accumulator / system-bet logic.
 *
 * @param {number} amount - Stake entered by the user
 * @returns {number}      - Total stake, rounded to 2 decimals
 */
export function calculateTotal(amount) {
  return round2(amount);
}

/**
 * Calculates the potential gain for an accumulator bet.
 *
 * All odds are multiplied together, then by the stake amount.
 *
 * @param {Selection[]} selections - Active selections
 * @param {number}      amount     - Stake
 * @returns {number}               - Potential gain, rounded to 2 decimals
 */
export function calculatePotentialGain(selections, amount) {
  if (!selections.length || amount <= 0) return 0;

  const combinedOdds = selections.reduce((acc, s) => acc * s.odd, 1);
  return round2(combinedOdds * amount);
}

/**
 * Validates a stake amount string entered by the user.
 *
 * @param {string} raw - Raw input from the amount field
 * @returns {{ valid: boolean; value: number; error: string|null }}
 */
export function validateAmount(raw) {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { valid: false, value: 0, error: "Amount is required." };
  }

  const numeric = Number(trimmed);

  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return { valid: false, value: 0, error: "Amount must be a number." };
  }

  if (numeric < MIN_AMOUNT) {
    return {
      valid: false,
      value: numeric,
      error: `Minimum stake is €${MIN_AMOUNT}.`,
    };
  }

  if (numeric > MAX_AMOUNT) {
    return {
      valid: false,
      value: numeric,
      error: `Maximum stake is €${MAX_AMOUNT.toLocaleString()}.`,
    };
  }

  return { valid: true, value: numeric, error: null };
}

/**
 * Rounds a number to 2 decimal places.
 *
 * @private
 * @param {number} n
 * @returns {number}
 */
function round2(n) {
  return Math.round(n * 100) / 100;
}
