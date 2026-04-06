"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export interface BreadcrumbItem {
  label_cy: string;
  label_en: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { locale } = useI18n();

  const allItems: BreadcrumbItem[] = [
    { label_cy: "Hafan", label_en: "Home", href: "/" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: locale === "cy" ? item.label_cy : item.label_en,
      ...(item.href ? { item: `https://gofal.wales${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-plum">
        <ol className="flex flex-wrap items-center gap-1">
          {allItems.map((item, index) => {
            const label = locale === "cy" ? item.label_cy : item.label_en;
            const isLast = index === allItems.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <span className="text-blush-grey" aria-hidden="true">/</span>
                )}
                {isLast || !item.href ? (
                  <span className="text-dusk font-semibold" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
