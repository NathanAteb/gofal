"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { getCountyBySlug } from "@/lib/utils/counties";

interface SearchBarProps {
  defaultValue?: string;
  size?: "lg" | "md";
}

interface Suggestion {
  type: "home" | "town";
  label: string;
  sublabel: string;
  slug?: string;
}

export function SearchBar({ defaultValue = "", size = "md" }: SearchBarProps) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&per_page=6`);
      const data = await res.json();
      const homes: Suggestion[] = (data.homes || []).slice(0, 5).map((h: { name: string; name_cy: string | null; town: string; postcode: string; slug: string }) => ({
        type: "home" as const,
        label: (locale === "cy" && h.name_cy) ? h.name_cy : h.name,
        sublabel: `${h.town}, ${h.postcode}`,
        slug: h.slug,
      }));

      // Extract unique towns from results
      const seenTowns = new Set<string>();
      const towns: Suggestion[] = [];
      for (const h of data.homes || []) {
        const town = h.town as string;
        if (town && !seenTowns.has(town.toLowerCase()) && town.toLowerCase().includes(q.toLowerCase())) {
          seenTowns.add(town.toLowerCase());
          towns.push({
            type: "town",
            label: town,
            sublabel: h.county ? `${(() => { const c = getCountyBySlug(h.county); return c ? (locale === "cy" ? c.name_cy : c.name_en) : h.county; })()}, ${locale === "cy" ? "Cymru" : "Wales"}` : (locale === "cy" ? "Cymru" : "Wales"),
          });
          if (towns.length >= 3) break;
        }
      }

      setSuggestions([...towns, ...homes]);
    } catch {
      setSuggestions([]);
    }
  }, [locale]);

  function handleChange(value: string) {
    setQuery(value);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 200);
    setShowDropdown(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setShowDropdown(false);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/cartrefi-gofal?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/cartrefi-gofal");
    }
  }

  function handleSelect(s: Suggestion) {
    setShowDropdown(false);
    if (s.type === "home" && s.slug) {
      router.push(`/cartrefi-gofal/${s.slug}`);
    } else {
      setQuery(s.label);
      router.push(`/cartrefi-gofal?q=${encodeURIComponent(s.label)}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLg = size === "lg";
  const hasTowns = suggestions.some((s) => s.type === "town");
  const hasHomes = suggestions.some((s) => s.type === "home");

  return (
    <div ref={wrapperRef} className="relative w-full">
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
            type="search"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
            placeholder={t("hero.search_placeholder")}
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={showDropdown && suggestions.length > 0}
            aria-autocomplete="list"
            className={`w-full rounded-full border border-blush-grey bg-white pl-10 pr-4 font-body text-dusk placeholder:text-muted-plum/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              isLg ? "py-4 text-lg" : "py-2.5 text-sm"
            }`}
          />
        </div>
        <button
          type="submit"
          className={`shrink-0 rounded-full bg-secondary font-body font-bold text-white transition-colors hover:bg-secondary-hover ${
            isLg ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-sm"
          }`}
        >
          {t("hero.search_button")}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[16px] border border-blush-grey bg-white shadow-modal">
          {/* Towns section */}
          {hasTowns && (
            <>
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-plum">
                  {locale === "cy" ? "Lleoliadau" : "Locations"}
                </p>
              </div>
              {suggestions.filter((s) => s.type === "town").map((s, i) => {
                const globalIdx = suggestions.indexOf(s);
                return (
                  <button
                    key={`town-${i}`}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIndex === globalIdx ? "bg-linen" : "hover:bg-linen"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dusk truncate">{s.label}</p>
                      <p className="text-xs text-muted-plum truncate">{s.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* Care homes section */}
          {hasHomes && (
            <>
              <div className={`px-4 pt-3 pb-1 ${hasTowns ? "border-t border-blush-grey" : ""}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-plum">
                  {locale === "cy" ? "Cartrefi gofal" : "Care homes"}
                </p>
              </div>
              {suggestions.filter((s) => s.type === "home").map((s, i) => {
                const globalIdx = suggestions.indexOf(s);
                return (
                  <button
                    key={`home-${i}`}
                    onClick={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIndex === globalIdx ? "bg-linen" : "hover:bg-linen"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-dusk truncate">{s.label}</p>
                      <p className="text-xs text-muted-plum truncate">{s.sublabel}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-plum/40">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
