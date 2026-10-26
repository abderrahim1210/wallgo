export default function ButtonSpinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="inline-block h-[1.25em] w-[1.25em] shrink-0"
    >
      <style>{`
        .wgo-s{animation:wgo-slide 1s cubic-bezier(.4,0,.2,1) infinite alternate}
        .wgo-s2{animation-direction:alternate-reverse}
        @keyframes wgo-slide{from{transform:translateX(-3.5px)}to{transform:translateX(3.5px)}}
        @keyframes wgo-fade{from{opacity:.3}to{opacity:1}}
        @media (prefers-reduced-motion:reduce){.wgo-s{animation:wgo-fade 1.4s ease-in-out infinite alternate}}
      `}</style>
      <rect className="wgo-s"  style={{ animationDelay: '0s' }}    x="5" y="3.5"  width="14" height="4" rx="2" />
      <rect className="wgo-s wgo-s2" style={{ animationDelay: '-0.15s' }} x="5" y="10"   width="14" height="4" rx="2" />
      <rect className="wgo-s"  style={{ animationDelay: '-0.3s' }} x="5" y="16.5" width="14" height="4" rx="2" />
    </svg>
  );
}