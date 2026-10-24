/**
 * PagesIcon — no props, nothing to configure.
 *
 *  - Size  : follows the parent's font size  (text-xl, text-2xl ...)
 *  - Color : follows the parent's text color (text-indigo-600 ...)
 *
 * Usage:
 *   <span className="text-2xl text-indigo-600"><PagesIcon /></span>
 */
export default function PagesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="block h-[1em] w-[1em]"
    >
      {/* the page */}
      <rect x="4" y="3" width="16" height="18" rx="3.5" />
      {/* cover divider, with a gap for the avatar */}
      <path d="M4 9H6.5M11.5 9H20" />
      {/* avatar */}
      <circle cx="9" cy="9" r="2.5" />
      {/* name + bio lines */}
      <path d="M7.5 15.5H16.5M7.5 18H13" />
    </svg>
  );
}