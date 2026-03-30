/**
 * @module domain/event/event.mapper
 * @description
 * Anti-corruption layer: maps raw infrastructure data into clean domain models.
 *
 * WHY this exists:
 *  - The API payload uses dynamic object keys for bets (e.g. `{ "953125720": {...} }`).
 *  - The UI must never couple to API shape — it depends only on domain models.
 *  - All defensive defaults (nullish coalescing, fallbacks) are applied HERE,
 *    keeping the rest of the codebase clean.
 */

/**
 * @typedef {import('./event.model').Event}   Event
 * @typedef {import('./event.model').Choice}  Choice
 */

/**
 * Maps a raw API event object into a normalized domain {@link Event}.
 *
 * @param {Object} raw - Raw event object from the data source
 * @returns {Event}
 */
export function mapEventFromApi(raw) {
  const bet = extractFirstBet(raw.bet);
  const choices = mapChoices(bet?.choices ?? []);

  return {
    id: raw.id,
    label: raw.label ?? deriveLabelFromChoices(choices),
    start: parseDate(raw.start),
    competition: raw.competition?.label ?? "",
    category: raw.category?.label ?? "",
    sport: raw.sport?.label ?? "",
    icon: raw.sport?.icon ?? "",
    question: bet?.question?.label ?? "",
    choices,
  };
}

/**
 * Derives a human-readable event label from its mapped choices when the API
 * does not provide one.
 *
 * Strategy: join the first two participant labels with " / " (e.g. "Turquie / Pays-Bas").
 * Neutral/draw choices (actorId === 1 in this dataset) are excluded since they are
 * not teams or participants and would produce a misleading label.
 * Falls back to "Unknown Event" when fewer than two participants can be identified.
 *
 * @private
 * @param {Choice[]} choices - Already-mapped domain choices
 * @returns {string}
 */
function deriveLabelFromChoices(choices) {
  const NEUTRAL_ACTOR_ID = 1;

  const participants = choices
    .filter((c) => c.actorId !== NEUTRAL_ACTOR_ID)
    .map((c) => c.label);

  if (participants.length < 2) return "Unknown Event";

  return `${participants[0]} / ${participants[1]}`;
}

/**
 * Extracts the first bet entry from the dynamic bet object.
 *
 * @private
 * @param {Object|undefined} betObject - The raw `bet` field (dynamic keys)
 * @returns {Object|null}
 */
function extractFirstBet(betObject) {
  if (!betObject) return null;
  const entries = Object.values(betObject);
  return entries.length > 0 ? entries[0] : null;
}

/**
 * Maps raw API choice objects into domain {@link Choice} objects.
 *
 * @private
 * @param {Object[]} rawChoices
 * @returns {Choice[]}
 */
function mapChoices(rawChoices) {
  return rawChoices.map((c) => ({
    id: c.id,
    actorId: c.actor?.id ?? null,
    label: c.actor?.label ?? "Unknown",
    odd: typeof c.odd === "number" ? c.odd : 0,
  }));
}

/**
 * Safely parses an ISO date string into a Date object.
 *
 * @private
 * @param {string|undefined} value
 * @returns {Date|null}
 */
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
