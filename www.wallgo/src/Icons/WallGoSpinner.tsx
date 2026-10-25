export default function WallGoSpinner() {
    return (
        <svg
            viewBox="0 0 64 64"
            role="status"
            aria-label="Loading"
            className="inline-block h-[1em] w-[1em] align-[-0.125em]"
        >
            <style>{`
        .wg-b{transform-box:fill-box;transform-origin:left center;animation:wg-build 1.8s cubic-bezier(.4,0,.2,1) infinite both}
        @keyframes wg-build{
          0%{transform:translateX(0) scaleX(0);opacity:0}
          28%{transform:translateX(0) scaleX(1);opacity:1}
          68%{transform:translateX(0) scaleX(1);opacity:1}
          100%{transform:translateX(8px) scaleX(1);opacity:0}
        }
        @media (prefers-reduced-motion:reduce){.wg-b{animation:none}}
      `}</style>

            <g style={{ fill: 'var(--special-purple)' }}>
                <rect className="wg-b" style={{ animationDelay: "0s" }} x="2.57" y="2.00" width="28.48" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.12s" }} x="2.57" y="14.53" width="17.47" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.19s" }} x="23.08" y="14.53" width="23.16" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.24s" }} x="2.57" y="27.06" width="28.48" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.31s", fill: 'var(--special-red)' }} x="34.09" y="27.06" width="27.34" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.36s" }} x="2.57" y="39.59" width="17.47" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.43s" }} x="23.08" y="39.59" width="23.16" height="9.87" rx="4.94" />
                <rect className="wg-b" style={{ animationDelay: "0.48s" }} x="2.57" y="52.13" width="28.48" height="9.87" rx="4.94" />
            </g>
        </svg>
    );
}