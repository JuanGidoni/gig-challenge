/**
 * @module ui/hooks/useBetSlip
 * @description
 * React state manager for the bet slip.
 *
 * This hook is the ONLY place where React state management for the bet
 * slip lives. It delegates all domain logic to domain services, keeping
 * the hook thin and testable in isolation.
 */

import { useCallback, useMemo, useState } from "react";
import {
  toggleSelection,
  removeSelection,
} from "../../domain/bet-slip/bet-slip.service";
import {
  calculateTotal,
  calculatePotentialGain,
  validateAmount,
  MIN_AMOUNT,
} from "../../domain/bet-slip/calculations.service";

/**
 * @typedef {import('../../domain/selection/selection.model').Selection} Selection
 */

/**
 * @typedef {Object} BetSlipState
 * @property {Selection[]} selections    - Currently selected bets
 * @property {number}      amount        - Current stake
 * @property {string}      amountInput   - Raw input string (for controlled input)
 * @property {string|null} amountError   - Validation error message, or null
 * @property {number}      total         - Calculated total stake
 * @property {number}      potentialGain - Calculated potential gain
 */

/**
 * @typedef {Object} BetSlipActions
 * @property {(selection: Selection) => void} handleToggle       - Toggle a selection
 * @property {(selection: Selection) => void} handleRemove       - Remove a selection
 * @property {(raw: string) => void}          handleAmountChange - Handle raw input change
 * @property {() => void}                     handleIncrement    - Increase amount by 1
 * @property {() => void}                     handleDecrement    - Decrease amount by 1
 */

/**
 * Manages bet slip state and exposes actions to the UI layer.
 *
 * @returns {BetSlipState & BetSlipActions}
 */
export function useBetSlip() {
  const [selections, setSelections] = useState(/** @type {Selection[]} */ ([]));
  const [amount, setAmount] = useState(MIN_AMOUNT);
  const [amountInput, setAmountInput] = useState(String(MIN_AMOUNT));
  const [amountError, setAmountError] = useState(/** @type {string|null} */ (null));

  /** @type {(selection: Selection) => void} */
  const handleToggle = useCallback((selection) => {
    setSelections((prev) => toggleSelection(prev, selection));
  }, []);

  /** @type {(selection: Selection) => void} */
  const handleRemove = useCallback((selection) => {
    setSelections((prev) => removeSelection(prev, selection));
  }, []);

  /** @type {(raw: string) => void} */
  const handleAmountChange = useCallback((raw) => {
    setAmountInput(raw);
    const result = validateAmount(raw);
    setAmountError(result.error);
    if (result.valid) {
      setAmount(result.value);
    }
  }, []);

  const handleIncrement = useCallback(() => {
    const next = amount + 1;
    setAmount(next);
    setAmountInput(String(next));
    setAmountError(null);
  }, [amount]);

  const handleDecrement = useCallback(() => {
    const result = validateAmount(String(amount - 1));
    if (result.valid) {
      setAmount(result.value);
      setAmountInput(String(result.value));
      setAmountError(null);
    }
  }, [amount]);

  const total = useMemo(() => calculateTotal(amount), [amount]);
  const potentialGain = useMemo(
    () => calculatePotentialGain(selections, amount),
    [selections, amount],
  );

  return {
    selections,
    amount,
    amountInput,
    amountError,
    total,
    potentialGain,
    handleToggle,
    handleRemove,
    handleAmountChange,
    handleIncrement,
    handleDecrement,
  };
}
