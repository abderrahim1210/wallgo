import type React from "react";

interface SearchIconProps {
    className?:string;
}

export const SearchIcon : React.FC<SearchIconProps> = ({className}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`block h-[1em] w-[1em] ${className}`}
    >
      <circle cx="10.5" cy="10.5" r="7.25" />
      <path d="M15.8 15.8L20.5 20.5" />
      <circle cx="10.5" cy="8.8" r="1.5" />
      <path d="M7.7 13.4C8.3 12 9.2 11.4 10.5 11.4C11.8 11.4 12.7 12 13.3 13.4" />
    </svg>
  );
}