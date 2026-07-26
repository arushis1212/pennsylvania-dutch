import { describe, it, expect } from "vitest";
import {
  MAX_HOOVES,
  REGEN_INTERVAL_MS,
  initialEnergy,
  resolveEnergy,
  spendHoof,
  msUntilNextHoof,
  formatCountdown,
} from "../energy";

const T0 = 1_000_000_000_000;

describe("energy / Hooves", () => {
  it("starts full", () => {
    expect(initialEnergy(T0)).toEqual({ hooves: MAX_HOOVES, updatedAt: T0 });
  });

  it("spends a hoof and starts the regen clock", () => {
    const s = spendHoof(initialEnergy(T0), T0);
    expect(s.hooves).toBe(MAX_HOOVES - 1);
    expect(s.updatedAt).toBe(T0);
  });

  it("does not go below zero", () => {
    let s = initialEnergy(T0);
    for (let i = 0; i < MAX_HOOVES + 3; i++) s = spendHoof(s, T0);
    expect(s.hooves).toBe(0);
  });

  it("regenerates one hoof per interval", () => {
    const spent = { hooves: 2, updatedAt: T0 };
    const later = resolveEnergy(spent, T0 + REGEN_INTERVAL_MS + 5);
    expect(later.hooves).toBe(3);
    // remainder carried, not reset to `now`
    expect(later.updatedAt).toBe(T0 + REGEN_INTERVAL_MS);
  });

  it("does NOT regenerate instantly (pacing lever)", () => {
    const spent = { hooves: 1, updatedAt: T0 };
    const soon = resolveEnergy(spent, T0 + 60_000); // one minute later
    expect(soon.hooves).toBe(1);
  });

  it("caps at max and idles the clock", () => {
    const spent = { hooves: 4, updatedAt: T0 };
    const full = resolveEnergy(spent, T0 + 10 * REGEN_INTERVAL_MS);
    expect(full.hooves).toBe(MAX_HOOVES);
    expect(full.updatedAt).toBe(T0 + 10 * REGEN_INTERVAL_MS);
  });

  it("reports time until next hoof", () => {
    const spent = { hooves: 1, updatedAt: T0 };
    expect(msUntilNextHoof(spent, T0)).toBe(REGEN_INTERVAL_MS);
    expect(msUntilNextHoof(initialEnergy(T0), T0)).toBe(0);
  });

  it("formats countdowns", () => {
    expect(formatCountdown(0)).toBe("full");
    expect(formatCountdown(90 * 60 * 1000)).toBe("1h 30m");
    expect(formatCountdown(45 * 60 * 1000)).toBe("45m");
  });
});
