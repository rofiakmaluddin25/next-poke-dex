"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export default function Header({
  onSearch,
  searchPlaceholder = "Search Pokemon",
}: HeaderProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a1a2e]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Go to Pokédex home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 shadow-lg shadow-blue-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Next Pokedex
          </span>
        </Link>

        <div className="relative ml-auto w-full max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="header-search"
            type="search"
            value={query}
            onChange={handleChange}
            placeholder={searchPlaceholder}
            aria-label="Search"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pr-4 pl-9 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none focus:border-blue-500/60 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>
    </header>
  );
}
