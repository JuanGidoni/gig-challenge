/**
 * @module ui/hooks/useEvents
 * @description
 * React adapter for the `getEvents` use case.
 *
 * Bridges the React lifecycle with application-layer logic.
 * The hook is deliberately thin — no business logic lives here.
 */

import { useMemo } from "react";
import { eventsData } from "../../infrastructure/data/events.data";
import { getEvents } from "../../application/use-cases/getEvents";

/**
 * @typedef {import('../../domain/event/event.model').Event} Event
 */

/**
 * Provides the list of domain events derived from the static data source.
 *
 * The computation is memoized: events are only mapped once per mount.
 *
 * @returns {{ events: Event[] }}
 */
export function useEvents() {
  const events = useMemo(() => getEvents(eventsData), []);
  return { events };
}
