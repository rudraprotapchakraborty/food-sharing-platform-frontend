import { Link } from "react-router-dom";

/** A plate with a leaf on it. */
export function LogoMark({ size = 34, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="13" fill="#d9480f" />
      <circle cx="24" cy="27" r="13" fill="#fff" />
      <circle cx="24" cy="27" r="7.5" fill="none" stroke="#d9480f" strokeWidth="2.4" />
      <path d="M33.5 8.5C27 8.5 22.5 12 22.5 18.5c6.5 0 11-3.5 11-10z" fill="#4ade80" stroke="#d9480f" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export default function Brand({ className = "" }) {
  return (
    <Link to="/" aria-label="FoodShare home" className={`inline-flex w-fit items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="whitespace-nowrap text-[20px] font-bold leading-none tracking-[-0.045em] text-ink sm:text-[22px]">
        Food<span className="accent text-[26px]">Share</span>
      </span>
    </Link>
  );
}
