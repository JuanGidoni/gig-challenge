/**
 * @module ui/components/bet-slip-section/BetSlipSection
 * @description
 * The bet slip panel — displays active selections, controls the stake,
 * shows totals and potential gain, and allows submission.
 *
 * Purely presentational: all interactions bubble up via callbacks.
 */

import "./BetSlipSection.css";

/**
 * @typedef {import('../../../domain/selection/selection.model').Selection} Selection
 */

/**
 * @typedef {Object} BetSlipSectionProps
 * @property {Selection[]}                          selections      - Active selections
 * @property {number}                               amount          - Current stake
 * @property {string}                               amountInput     - Raw controlled input value
 * @property {string|null}                          amountError     - Validation error, or null
 * @property {number}                               total           - Calculated total
 * @property {number}                               potentialGain   - Calculated potential gain
 * @property {(s: Selection) => void}               onRemove        - Remove a selection
 * @property {(raw: string) => void}                onAmountChange  - Handle input change
 * @property {() => void}                           onIncrement     - Increase stake by 1
 * @property {() => void}                           onDecrement     - Decrease stake by 1
 */

/**
 * BetSlipSection component.
 *
 * @param {BetSlipSectionProps} props
 * @returns {JSX.Element}
 */
export default function BetSlipSection({
  selections,
  amountInput,
  amountError,
  total,
  potentialGain,
  onRemove,
  onAmountChange,
  onIncrement,
  onDecrement,
}) {
  const isEmpty = selections.length === 0;

  return (
    <aside className="bet-slip">
      {/* ── Title ── */}
      <header className="bet-slip__header">
        <h2 className="bet-slip__title">My Choices</h2>
        {!isEmpty && (
          <span className="bet-slip__count">{selections.length}</span>
        )}
      </header>

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="bet-slip__empty">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" />
            <path
              d="M9 15l2 2 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>No bets chosen</p>
          <span>Select a pick from the events</span>
        </div>
      )}

      {/* ── Selections list ── */}
      {!isEmpty && (
        <ul className="bet-slip__list">
          {selections.map((s) => (
            <li key={`${s.eventId}-${s.choiceId}`} className="bet-slip__item">
              <div className="bet-slip__item-top">
                <span className="bet-slip__item-event">{s.eventLabel}</span>
                <button
                  type="button"
                  className="bet-slip__remove"
                  aria-label={`Remove ${s.label}`}
                  onClick={() => onRemove(s)}
                >
                  ✕
                </button>
              </div>
              <p className="bet-slip__item-question">{s.question}</p>
              <div className="bet-slip__item-pick">
                <span>{s.label}</span>
                <strong>{s.odd.toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── Amount controls ── */}
      <div className="bet-slip__stake">
        <label className="bet-slip__stake-label" htmlFor="bet-amount">
          Stake
        </label>
        <div className="bet-slip__stake-controls">
          <button
            type="button"
            className="bet-slip__stepper"
            aria-label="Decrease stake"
            onClick={onDecrement}
          >
            −
          </button>
          <input
            id="bet-amount"
            type="text"
            inputMode="decimal"
            className={`bet-slip__amount-input${amountError ? " bet-slip__amount-input--error" : ""}`}
            value={amountInput}
            onChange={(e) => onAmountChange(e.target.value)}
            aria-describedby={amountError ? "amount-error" : undefined}
          />
          <button
            type="button"
            className="bet-slip__stepper"
            aria-label="Increase stake"
            onClick={onIncrement}
          >
            +
          </button>
        </div>
        {amountError && (
          <p id="amount-error" className="bet-slip__amount-error" role="alert">
            {amountError}
          </p>
        )}
      </div>

      {/* ── Totals ── */}
      <div className="bet-slip__totals">
        <div className="bet-slip__total-row">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
        <div className="bet-slip__total-row bet-slip__total-row--gain">
          <span>Potential Gain</span>
          <strong>{potentialGain.toFixed(2)} €</strong>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="button"
        className="bet-slip__submit"
        disabled={isEmpty || !!amountError}
      >
        Submit Bets
      </button>
    </aside>
  );
}
