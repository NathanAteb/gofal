"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

interface SearchBarProps {
  defaultValue?: string;
  size?: "lg" | "md";
}

export function SearchBar({ defaultValue = "", size = "md" }: SearchBarProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/cartrefi-gofal?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/cartrefi-gofal");
    }
  }

  const isLg = size === "lg";

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-plum"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("hero.search_placeholder")}
          className={`w-full rounded-full border border-blush-grey bg-white pl-10 pr-4 font-body text-dusk placeholder:text-muted-plum/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            isLg ? "py-4 text-lg" : "py-2.5 text-sm"
          }`}
        />
      </div>
      <button
        type="submit"
        className={`shrink-0 rounded-full bg-secondary font-body font-bold text-white transition-colors hover:bg-secondary/90 ${
          isLg ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-sm"
        }`}
      >
        {t("hero.search_button")}
      </button>
    </form>
  );
}
