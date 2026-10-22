import type { SVGProps } from "react";

/**
 * AnimatedMenuIcon
 * ----------------
 * Hamburger icon for an offcanvas menu / sidebar drawer.
 *
 * Hover behaviour ("drawer sliding in" feel):
 *   - top + bottom bars shrink to 60% width, anchored on the left
 *   - the middle bar slides 2px to the right and stays full width
 *   - the three bars are staggered by 75ms for a smooth ripple
 *
 * Pure CSS (Tailwind utilities) — no JS animation library, no hover state.
 *
 * Usage:
 *   <button className="group p-2" aria-label="Open menu">
 *     <AnimatedMenuIcon size={28} color="#7371FC" />
 *   </button>
 *
 * Wrapping it in a `group` parent (like the button above) makes the whole
 * button trigger the animation, not just the 24px icon.
 */

export interface AnimatedMenuIconProps
  extends Omit<SVGProps<SVGSVGElement>, "width" | "height" | "color"> {
  /** Icon width/height in px. Default: 24 */
  size?: number;
  /** Any CSS color. Default: "currentColor" (inherits text color) */
  color?: string;
  /** Extra Tailwind / CSS classes */
  className?: string;
}

/**
 * Classes shared by the 3 bars.
 *
 * - transition-transform        -> only animate `transform` (cheap, GPU friendly)
 * - duration-300                -> 300ms per transition
 * - ease-[cubic-bezier(...)]    -> Material "standard" easing: quick start, soft landing
 * - [transform-box:fill-box]    -> makes transform-origin relative to each bar's own box
 *                                  (without it, SVG elements use the whole <svg> as reference)
 * - motion-reduce:transition-none -> respects "reduce motion" accessibility setting
 */
const bar =
  "[transform-box:fill-box] transition-transform duration-300 " +
  "ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

export default function AnimatedMenuIcon({
  size = 24,
  color = "currentColor",
  className = "",
  ...props
}: AnimatedMenuIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden={props["aria-label"] ? undefined : true}
      // `group` lets the bars react to hover/focus on the svg itself
      // (or on any parent that also has the `group` class).
      className={`group ${className}`}
      {...props}
    >
      {/* Top bar: origin-left => shrinks toward the left edge */}
      <rect
        x="3"
        y="5"
        width="18"
        height="2"
        rx="1"
        className={`${bar} origin-left group-hover:scale-x-[0.6] group-focus-visible:scale-x-[0.6]`}
      />

      {/* Middle bar: slides right by 2px, 75ms delay for the stagger */}
      <rect
        x="3"
        y="11"
        width="18"
        height="2"
        rx="1"
        className={`${bar} delay-75 group-hover:translate-x-[2px] group-focus-visible:translate-x-[2px]`}
      />

      {/* Bottom bar: same as top, 150ms delay */}
      <rect
        x="3"
        y="17"
        width="18"
        height="2"
        rx="1"
        className={`${bar} origin-left delay-150 group-hover:scale-x-[0.6] group-focus-visible:scale-x-[0.6]`}
      />
    </svg>
  );
}