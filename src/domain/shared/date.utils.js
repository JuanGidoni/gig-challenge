/**
 * @module domain/shared/date.utils
 * @description
 * Shared, pure date-formatting utilities.
 * No framework dependencies.
 */

/**
 * Formats an event start date for display in the UI.
 *
 * Output example: "24 March · 20:45"
 *
 * @param {Date|null} date - The parsed event start date
 * @returns {string}       - Human-readable date string, or "TBC" if unavailable
 */
export function formatEventDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "TBC";
  }

  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${dayMonth} · ${time}`;
}
