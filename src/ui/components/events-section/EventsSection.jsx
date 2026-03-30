/**
 * @module ui/components/events-section/EventsSection
 * @description
 * Container that renders the breadcrumb header and the list of event cards.
 * Groups events under a shared sport/competition context.
 */

import EventCard from "../event-card/EventCard";
import "./EventsSection.css";

/**
 * @typedef {import('../../../domain/event/event.model').Event}            Event
 * @typedef {import('../../../domain/selection/selection.model').Selection} Selection
 */

/**
 * @typedef {Object} EventsSectionProps
 * @property {Event[]}       events     - Events to display
 * @property {Selection[]}   selections - Active bet slip selections
 * @property {(selection: Selection) => void} onToggle - Bubbles selection toggle up
 */

/**
 * EventsSection component.
 *
 * @param {EventsSectionProps} props
 * @returns {JSX.Element}
 */
export default function EventsSection({ events, selections, onToggle }) {
  if (events.length === 0) {
    return (
      <div className="events-section events-section--empty">
        No events available.
      </div>
    );
  }

  const { sport, category } = events[0];

  return (
    <section className="events-section">
      {/* Breadcrumb */}
      <header className="section-header">
        <svg
          className="section-header__sport-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
          />
          <path
            d="M12 2 C8 6 8 10 12 12 C16 10 16 6 12 2Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M2 12 C6 8 10 8 12 12 C10 16 6 16 2 12Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M22 12 C18 16 14 16 12 12 C14 8 18 8 22 12Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M12 22 C16 18 16 14 12 12 C8 14 8 18 12 22Z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
        <span className="section-header__breadcrumb">
          <strong>{sport}</strong>
          {category && ` · ${category}`}
        </span>
      </header>

      {/* Event list */}
      <div className="events-section__list">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            selections={selections}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}
