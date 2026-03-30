/**
 * @module ui/components/event-card/EventCard
 * @description
 * Renders a single betting event with its available choices.
 * Purely presentational — all state changes bubble up via `onToggle`.
 */

import { formatEventDate } from "../../../domain/shared/date.utils";
import "./EventCard.css";

/**
 * @typedef {import('../../../domain/event/event.model').Event}       Event
 * @typedef {import('../../../domain/selection/selection.model').Selection} Selection
 */

/**
 * @typedef {Object} EventCardProps
 * @property {Event}       event      - The event to display
 * @property {Selection[]} selections - Currently active bet slip selections
 * @property {(selection: Selection) => void} onToggle - Called when a choice is clicked
 */

/**
 * EventCard component.
 *
 * @param {EventCardProps} props
 * @returns {JSX.Element}
 */
export default function EventCard({ event, selections, onToggle }) {
  return (
    <article className="event-card">
      {/* ── Header ── */}
      <div className="event-card__header">
        <div className="event-card__meta">
          <span className="event-card__competition">{event.competition}</span>
          <h3 className="event-card__title">{event.label}</h3>
        </div>
        <time
          className="event-card__date"
          dateTime={event.start?.toISOString()}
        >
          {formatEventDate(event.start)}
        </time>
      </div>

      {/* ── Question label ── */}
      {event.question && (
        <p className="event-card__question">{event.question}</p>
      )}

      {/* ── Choices ── */}
      <div className="event-card__choices">
        {event.choices.map((choice) => {
          const isSelected = selections.some(
            (s) => s.eventId === event.id && s.choiceId === choice.id,
          );

          return (
            <button
              key={`${event.id}-${choice.id}`}
              type="button"
              aria-pressed={isSelected}
              className={`event-card__choice${isSelected ? " event-card__choice--selected" : ""}`}
              onClick={() =>
                onToggle({
                  eventId: event.id,
                  eventLabel: event.label,
                  choiceId: choice.id,
                  label: choice.label,
                  odd: choice.odd,
                  question: event.question,
                })
              }
            >
              <span className="event-card__choice-label">{choice.label}</span>
              <span className="event-card__choice-odd">
                {choice.odd.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
