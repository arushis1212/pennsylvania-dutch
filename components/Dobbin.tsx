"use client";

/**
 * Dobbin - the Deitsh mascot. Now rendered from REAL illustrated PNG artwork in
 * /public/images/dobbin/ (not hand-coded SVG). Each app state maps to a pose
 * file. To add/adjust poses, drop new PNGs in that folder and extend POSE below
 * - do NOT hand-draw SVG. Keep the character's hat / blue shirt / suspenders
 * consistent across any future art (see CLAUDE.md art direction).
 *
 * The image is letterboxed inside a square `size`×`size` box (object-contain),
 * so this stays a drop-in replacement for the old square SVG footprint.
 */

export type DobbinMood =
  | "idle"
  | "wave"
  | "correct"
  | "incorrect"
  | "streak"
  | "complete"
  | "thinking"
  | "sleepy";

const BASE = "/images/dobbin/";

const POSE: Record<DobbinMood, { file: string; alt: string }> = {
  idle: { file: "dobbin-wave.png", alt: "waving hello" },
  wave: { file: "dobbin-wave.png", alt: "waving hello" },
  correct: { file: "dobbin-thumbsup.png", alt: "giving a thumbs up" },
  incorrect: { file: "dobbin-sad.png", alt: "looking a little sad" },
  streak: { file: "dobbin-jump.png", alt: "jumping for joy" },
  complete: { file: "dobbin-happy-wave.png", alt: "celebrating with a happy wave" },
  thinking: { file: "dobbin-thinking.png", alt: "thinking it over" },
  sleepy: { file: "dobbin-neutral.png", alt: "taking a breather" },
};

export function Dobbin({
  mood = "idle",
  size = 160,
  variant = "full",
  className = "",
}: {
  mood?: DobbinMood;
  size?: number;
  /**
   * "full" = whole character, letterboxed in the square box (hero/intro/etc.).
   * "bust" = head-to-torso crop that fills the box - better for small avatars
   * (header logo, answer-feedback), since the art is a tall full-body portrait.
   */
  variant?: "full" | "bust";
  className?: string;
}) {
  const pose = POSE[mood] ?? POSE.idle;

  const anim =
    mood === "correct" || mood === "streak" || mood === "complete"
      ? "animate-bouncey"
      : mood === "incorrect"
        ? "animate-headtilt"
        : mood === "idle" || mood === "wave"
          ? "animate-sway"
          : "";

  const bust = variant === "bust";

  return (
    <span
      className={`inline-block shrink-0 overflow-hidden ${anim} ${className}`}
      style={{ width: size, height: size, transformOrigin: "50% 90%" }}
    >
      {/* Real PNG mascot art - intentionally a plain <img> (static /public asset). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}${pose.file}`}
        alt={`Dobbin the horse ${pose.alt}`}
        width={size}
        height={size}
        draggable={false}
        className={`h-full w-full select-none ${bust ? "object-cover" : "object-contain"}`}
        style={bust ? { objectPosition: "50% 0%" } : undefined}
      />
    </span>
  );
}

/**
 * Short, silly encouragement "barks" per state (PRD 6.3 - text, not chat).
 * Tongue-in-cheek about the horse/app, never about the community.
 */
export const DOBBIN_BARKS: Record<"correct" | "incorrect" | "streak", string[]> = {
  correct: [
    "Yeehaw!",
    "Sell is recht! (Nailed it!)",
    "Hot diggity hay!",
    "Giddy-up, genius!",
    "Ya! *happy horse noises*",
  ],
  incorrect: [
    "Neigh… not quite.",
    "Whoa, close one!",
    "Hay, try again!",
    "Net ganz. One more go!",
    "*confused horse blink*",
  ],
  streak: [
    "You're unstoppabull! 🐴",
    "Streak! Dobbin's doing a little trot 🔥",
    "Look at you go, hay-ro!",
  ],
};
