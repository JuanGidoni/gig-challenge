/**
 * @module application/use-cases/getEvents
 * @description
 * Application-layer use case: retrieves and transforms events for display.
 *
 * Responsibilities:
 *  - Orchestrates mapping from infrastructure data to domain models.
 *  - Keeps the application layer framework-agnostic.
 *  - Provides the boundary between infrastructure and the rest of the app.
 *
 * @example
 * import { getEvents } from './getEvents';
 * import { eventsData } from '../../infrastructure/data/events.data';
 *
 * const events = getEvents(eventsData);
 */

import { mapEventFromApi } from "../../domain/event/event.mapper";

/**
 * @typedef {import('../../domain/event/event.model').Event} Event
 */

/**
 * Transforms a raw data source into an array of domain {@link Event} objects.
 *
 * @param {{ events: Object[] }} dataSource - Raw data source (infrastructure)
 * @returns {Event[]}                        - Normalized domain events
 */
export function getEvents(dataSource) {
  if (!dataSource?.events || !Array.isArray(dataSource.events)) {
    return [];
  }

  return dataSource.events.map(mapEventFromApi);
}
