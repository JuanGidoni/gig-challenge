/**
 * @module domain/selection/selection.model
 * @description
 * Pure domain model for a bet slip selection.
 * A Selection is created when the user picks a Choice on an Event.
 */

/**
 * @typedef {Object} Selection
 * @property {number} eventId    - The parent event's identifier
 * @property {string} eventLabel - Human-readable event name (denormalized for display)
 * @property {number} choiceId   - The selected choice's identifier
 * @property {string} label      - The selected choice's display label
 * @property {number} odd        - The odd at time of selection
 * @property {string} question   - The bet question (denormalized for display)
 */
