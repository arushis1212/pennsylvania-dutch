/**
 * Horseshoe - the canonical icon for one unit of Energy (Hooves). Used
 * everywhere Hooves are shown so lives read consistently (never mix with the
 * 🐴 horse-head emoji). Filled = a hoof you still have; empty = spent.
 */
export function Horseshoe({ filled, size = 26 }: { filled: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M7 3 C3 5 3 12 6 17 C7 19 9 20 9 20 L11 17 C10 16 8 13 8 10 C8 7 10 5 12 5 C14 5 16 7 16 10 C16 13 14 16 13 17 L15 20 C15 20 17 19 18 17 C21 12 21 5 17 3"
        fill={filled ? "#c8402f" : "none"}
        stroke={filled ? "#87271d" : "#cca87d"}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
