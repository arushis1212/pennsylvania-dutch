/**
 * Folk-art motif set (CLAUDE.md "Art direction v2"): warm storybook-flat icons
 * with soft shading - buggies, barns, gardens, looms, waterwheels, windmills,
 * quilt borders, and the PA Dutch **hex sign** (barn star) used both as
 * decoration and as the Daily Hex review gameplay element.
 */

// Warm palette
const BARN = "#cf4632";
const BARN_DK = "#a83526";
const WOOD = "#a9743f";
const WOOD_DK = "#7f5530";
const WHEAT = "#ecc257";
const WHEAT_DK = "#d69a2f";
const SKY = "#5aa9d6";
const SKY_DK = "#3f8fbe";
const CREAM = "#f7edd8";
const LEAF = "#7fa657"; // muted folk sage - decorative only, never a Duolingo-green brand accent
const SLATE = "#4a453f";

type IconProps = { size?: number; className?: string };

function Frame({ size = 56, className = "", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

export function BuggyIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M14 40 v-13 a7 7 0 0 1 7 -7 h11 v20 z" fill={SLATE} />
      <path d="M32 40 v-20 h4 l8 20 z" fill="#5c564e" />
      <rect x="12" y="40" width="36" height="4" rx="2" fill={SLATE} />
      <circle cx="20" cy="47" r="7.5" fill={WHEAT} />
      <circle cx="44" cy="47" r="7.5" fill={WHEAT} />
      <circle cx="20" cy="47" r="2.5" fill={WHEAT_DK} />
      <circle cx="44" cy="47" r="2.5" fill={WHEAT_DK} />
    </Frame>
  );
}

export function BarnIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M12 30 L32 15 L52 30 z" fill={BARN_DK} />
      <rect x="14" y="30" width="36" height="22" fill={BARN} />
      <rect x="26" y="37" width="12" height="15" fill={CREAM} />
      <rect x="31" y="37" width="2" height="15" fill={BARN_DK} />
      <rect x="26" y="43" width="12" height="2" fill={BARN_DK} />
      <path d="M17 34 h7 v6 h-7 z" fill={WHEAT} />
      <path d="M20.5 34 v6 M17 37 h7" stroke={BARN_DK} strokeWidth="1" />
    </Frame>
  );
}

export function QuiltIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M14 14 h18 v18 h-18 z" fill={BARN} />
      <path d="M32 14 h18 v18 h-18 z" fill={SKY} />
      <path d="M14 32 h18 v18 h-18 z" fill={WHEAT} />
      <path d="M32 32 h18 v18 h-18 z" fill={WOOD} />
      <path d="M23 18 l5 5 -5 5 -5 -5 z" fill={CREAM} />
      <path d="M41 36 l5 5 -5 5 -5 -5 z" fill={CREAM} />
    </Frame>
  );
}

export function ChurnIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M22 24 L20 50 h24 L42 24 z" fill={WOOD} />
      <path d="M21 34 h22 l-0.7 -8 h-20.6 z" fill={CREAM} />
      <ellipse cx="32" cy="24" rx="10" ry="3.2" fill={CREAM} />
      <rect x="30" y="9" width="4" height="16" rx="2" fill={WOOD_DK} />
      <circle cx="32" cy="9" r="3" fill={WOOD_DK} />
    </Frame>
  );
}

export function WheatIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <rect x="30.5" y="30" width="3" height="24" rx="1.5" fill={WHEAT_DK} />
      <g fill={WHEAT}>
        <path d="M32 30 c-7 -1 -11 -6 -11 -13 c7 1 11 5 11 13 z" />
        <path d="M32 30 c7 -1 11 -6 11 -13 c-7 1 -11 5 -11 13 z" />
        <path d="M32 22 c-2 -5 -2 -10 0 -14 c2 4 2 9 0 14 z" fill={WHEAT_DK} />
      </g>
    </Frame>
  );
}

export function LanternIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <rect x="28" y="11" width="8" height="4" rx="2" fill={WOOD_DK} />
      <rect x="24" y="16" width="16" height="28" rx="5" fill={SKY} />
      <rect x="28" y="21" width="8" height="18" rx="3" fill={CREAM} />
      <ellipse cx="32" cy="31" rx="3" ry="6" fill={WHEAT} />
      <rect x="23" y="44" width="18" height="4" rx="2" fill={WOOD_DK} />
    </Frame>
  );
}

export function SiloIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M22 24 a10 10 0 0 1 20 0 v26 h-20 z" fill={CREAM} />
      <path d="M22 24 a10 10 0 0 1 20 0 z" fill={SKY} />
      <rect x="22" y="32" width="20" height="3" fill={WOOD} />
      <rect x="22" y="41" width="20" height="3" fill={WOOD} />
    </Frame>
  );
}

export function GardenIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M10 42 q22 -8 44 0 v10 h-44 z" fill={WOOD} />
      <path d="M10 42 q22 -8 44 0 v3 q-22 -7 -44 0 z" fill={WOOD_DK} />
      {/* rows of sprouts */}
      <g fill={LEAF}>
        <circle cx="20" cy="38" r="4" />
        <circle cx="32" cy="36" r="4" />
        <circle cx="44" cy="38" r="4" />
      </g>
      <g fill={BARN}>
        <circle cx="20" cy="34" r="2" />
        <circle cx="44" cy="34" r="2" />
      </g>
      <rect x="31" y="30" width="2" height="6" fill={WOOD_DK} />
    </Frame>
  );
}

export function LoomIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <rect x="14" y="14" width="4" height="38" rx="2" fill={WOOD_DK} />
      <rect x="46" y="14" width="4" height="38" rx="2" fill={WOOD_DK} />
      <rect x="12" y="16" width="40" height="4" rx="2" fill={WOOD} />
      {/* woven cloth */}
      <rect x="20" y="24" width="24" height="20" fill={CREAM} />
      <path d="M20 24 h24 v5 h-24 z" fill={BARN} />
      <path d="M20 34 h24 v5 h-24 z" fill={SKY} />
      <g stroke={WOOD} strokeWidth="1.5">
        <path d="M26 24 v20 M32 24 v20 M38 24 v20" />
      </g>
    </Frame>
  );
}

export function WaterwheelIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <rect x="10" y="44" width="44" height="8" fill={SKY} opacity="0.5" />
      <circle cx="30" cy="32" r="18" fill="none" stroke={WOOD} strokeWidth="4" />
      <circle cx="30" cy="32" r="4" fill={WOOD_DK} />
      <g stroke={WOOD_DK} strokeWidth="3">
        <path d="M30 14 v36 M12 32 h36 M17 19 l26 26 M43 19 l-26 26" />
      </g>
      {/* paddles */}
      <g fill={WOOD}>
        <rect x="27" y="10" width="6" height="6" />
        <rect x="47" y="29" width="6" height="6" />
        <rect x="27" y="48" width="6" height="6" />
        <rect x="7" y="29" width="6" height="6" />
      </g>
    </Frame>
  );
}

export function WindmillIcon(p: IconProps) {
  return (
    <Frame {...p}>
      <path d="M27 30 h10 l3 24 h-16 z" fill={CREAM} />
      <path d="M27 30 h10 l1 8 h-12 z" fill={WOOD} />
      <g fill={BARN} stroke={BARN_DK} strokeWidth="1">
        <path d="M32 28 l0 -18 6 3 z" />
        <path d="M32 28 l18 0 -3 6 z" />
        <path d="M32 28 l0 18 -6 -3 z" />
        <path d="M32 28 l-18 0 3 -6 z" />
      </g>
      <circle cx="32" cy="28" r="3" fill={WHEAT_DK} />
    </Frame>
  );
}

export const MOTIF_ICONS = {
  buggy: BuggyIcon,
  barn: BarnIcon,
  quilt: QuiltIcon,
  churn: ChurnIcon,
  wheat: WheatIcon,
  lantern: LanternIcon,
  silo: SiloIcon,
  garden: GardenIcon,
  loom: LoomIcon,
  waterwheel: WaterwheelIcon,
  windmill: WindmillIcon,
} as const;

export type MotifKey = keyof typeof MOTIF_ICONS;

// ---- Hex sign (barn star) - decoration + Daily Hex gameplay ----

const HEX_PALETTE = [BARN, SKY, WHEAT, WOOD, "#e08a3c", SKY_DK];

/**
 * A PA Dutch hex sign / barn star. Renders `segments` petals around a center
 * rosette; the first `filled` petals are colored in (the rest are pale
 * outlines). Used decoratively (filled=segments) and as the Daily Hex review
 * progress visual, where each correct answer fills one more petal.
 */
export function HexSign({
  segments = 6,
  filled = segments,
  size = 120,
  className = "",
}: {
  segments?: number;
  filled?: number;
  size?: number;
  className?: string;
}) {
  const cx = 100;
  const cy = 100;
  const outer = 84;
  const inner = 30;
  const petals = [];
  for (let i = 0; i < segments; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / segments;
    const aL = a - Math.PI / segments;
    const aR = a + Math.PI / segments;
    const tip = [cx + outer * Math.cos(a), cy + outer * Math.sin(a)];
    const bL = [cx + inner * Math.cos(aL), cy + inner * Math.sin(aL)];
    const bR = [cx + inner * Math.cos(aR), cy + inner * Math.sin(aR)];
    const on = i < filled;
    const color = on ? HEX_PALETTE[i % HEX_PALETTE.length] : "#efe6d2";
    petals.push(
      <path
        key={i}
        d={`M${cx} ${cy} L${bL[0].toFixed(1)} ${bL[1].toFixed(1)} L${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L${bR[0].toFixed(1)} ${bR[1].toFixed(1)} Z`}
        fill={color}
        stroke={on ? "rgba(0,0,0,0.12)" : "#e0d3b6"}
        strokeWidth="1.5"
        className={on ? "animate-pop" : ""}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />,
    );
  }
  const complete = filled >= segments;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden="true">
      <circle cx={cx} cy={cy} r="94" fill={CREAM} stroke={WOOD} strokeWidth="5" />
      <circle cx={cx} cy={cy} r="88" fill="none" stroke={complete ? WHEAT_DK : "#e6d9bd"} strokeWidth="2" />
      {petals}
      <circle cx={cx} cy={cy} r={inner - 4} fill={complete ? WHEAT : CREAM} stroke={WOOD} strokeWidth="3" />
      <circle cx={cx} cy={cy} r="8" fill={complete ? BARN : "#e0d3b6"} />
    </svg>
  );
}

// ---- Quilt decorations ----

/** A thin quilt-square band used as a section divider. */
export function QuiltBand({ className = "" }: { className?: string }) {
  const colors = [BARN, WHEAT, SKY, WOOD, CREAM];
  return (
    <div className={`flex h-3 w-full overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="h-full flex-1" style={{ backgroundColor: colors[i % colors.length] }} />
      ))}
    </div>
  );
}

/** A single decorative quilt patch (flying-geese / star square). */
export function QuiltPatch({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true">
      <rect width="40" height="40" fill={CREAM} />
      <path d="M20 4 L28 20 L20 36 L12 20 z" fill={BARN} />
      <path d="M4 20 L20 12 L36 20 L20 28 z" fill={SKY} opacity="0.85" />
      <circle cx="20" cy="20" r="4" fill={WHEAT} />
    </svg>
  );
}
