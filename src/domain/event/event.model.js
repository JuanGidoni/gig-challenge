/**
 * @module domain/event/event.model
 * @description
 * Pure domain model definitions for a betting Event.
 * These are plain value objects — no framework dependencies.
 */

/**
 * @typedef {Object} Choice
 * @property {number} id       - Unique choice identifier
 * @property {number} actorId  - The underlying actor's identifier (1 = draw/neutral)
 * @property {string} label    - Display label (e.g. "Turquie")
 * @property {number} odd      - Decimal odd for this choice
 */

/**
 * @typedef {Object} Event
 * @property {number}      id          - Unique event identifier
 * @property {string}      label       - Human-readable event name
 * @property {Date|null}   start       - Scheduled start date/time
 * @property {string}      competition - Competition name
 * @property {string}      category    - Category / league
 * @property {string}      sport       - Sport name
 * @property {string}      icon        - Sport icon key
 * @property {string}      question    - Bet question shown to user
 * @property {Choice[]}    choices     - Available betting choices
 */
