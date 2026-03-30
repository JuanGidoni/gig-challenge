/**
 * @file event.mapper.test.js
 * @description Unit tests for the event anti-corruption mapper.
 */

import { describe, it, expect } from "vitest";
import { mapEventFromApi } from "../domain/event/event.mapper";

const rawEvent = {
  id: 3340789,
  label: "Turquie / Pays-Bas",
  start: "2021-03-24T20:45:00.000+01:00",
  competition: { label: "Qualifications Coupe du Monde, UEFA" },
  category: { label: "International" },
  sport: { label: "Football", icon: "soccer" },
  bet: {
    953125720: {
      question: { label: "Qui va gagner le match ?" },
      choices: [
        { id: 4194768007, odd: 3.9, actor: { id: 28157, label: "Turquie" } },
        { id: 4194768008, odd: 3.1, actor: { id: 1, label: "Nul" } },
        { id: 4194768009, odd: 1.68, actor: { id: 28145, label: "Pays-Bas" } },
      ],
    },
  },
};

describe("mapEventFromApi", () => {
  it("maps id and label correctly", () => {
    const event = mapEventFromApi(rawEvent);
    expect(event.id).toBe(3340789);
    expect(event.label).toBe("Turquie / Pays-Bas");
  });

  it("parses start date into a Date object", () => {
    const event = mapEventFromApi(rawEvent);
    expect(event.start).toBeInstanceOf(Date);
    expect(event.start.getUTCFullYear()).toBe(2021);
  });

  it("maps competition and category labels", () => {
    const event = mapEventFromApi(rawEvent);
    expect(event.competition).toBe("Qualifications Coupe du Monde, UEFA");
    expect(event.category).toBe("International");
  });

  it("extracts the first bet's question", () => {
    const event = mapEventFromApi(rawEvent);
    expect(event.question).toBe("Qui va gagner le match ?");
  });

  it("maps all 3 choices", () => {
    const { choices } = mapEventFromApi(rawEvent);
    expect(choices).toHaveLength(3);
  });

  it("maps choice fields: id, actorId, label and odd", () => {
    const { choices } = mapEventFromApi(rawEvent);
    expect(choices[0]).toEqual({
      id: 4194768007,
      actorId: 28157,
      label: "Turquie",
      odd: 3.9,
    });
    expect(choices[1]).toEqual({
      id: 4194768008,
      actorId: 1,
      label: "Nul",
      odd: 3.1,
    });
    expect(choices[2]).toEqual({
      id: 4194768009,
      actorId: 28145,
      label: "Pays-Bas",
      odd: 1.68,
    });
  });

  it("preserves the neutral draw choice (actorId 1) in the choices array", () => {
    const { choices } = mapEventFromApi(rawEvent);
    const draw = choices.find((c) => c.actorId === 1);
    expect(draw).toBeDefined();
    expect(draw.label).toBe("Nul");
  });

  it("falls back to 'Unknown Event' when label is missing and no choices available", () => {
    const event = mapEventFromApi({
      ...rawEvent,
      label: undefined,
      bet: undefined,
    });
    expect(event.label).toBe("Unknown Event");
  });

  it("derives the label from participant choices when label is missing", () => {
    const event = mapEventFromApi({ ...rawEvent, label: undefined });
    // Nul (actorId 1) must be excluded — only real participants joined
    expect(event.label).toBe("Turquie / Pays-Bas");
  });

  it("returns null start when date is missing", () => {
    const event = mapEventFromApi({ ...rawEvent, start: undefined });
    expect(event.start).toBeNull();
  });

  it("returns empty choices array when bet is missing", () => {
    const event = mapEventFromApi({ ...rawEvent, bet: undefined });
    expect(event.choices).toEqual([]);
  });
});
