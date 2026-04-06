"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { formatDate } from "@/lib/utils/format";
import type { Guide } from "@/content/guides";

interface Props {
  guide: Guide;
}

export function GuideContent({ guide }: Props) {
  const { locale } = useI18n();

  const title = locale === "cy" ? guide.title_cy : guide.title_en;
  const content = locale === "cy" ? guide.content_cy : guide.content_en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: guide.published,
    author: { "@type": "Organization", name: "gofal.wales" },
    publisher: { "@type": "Organization", name: "gofal.wales" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label_cy: "Canllawiau", label_en: "Guides", href: "/canllawiau" },
            { label_cy: guide.title_cy, label_en: guide.title_en },
          ]}
        />

        <header className="mt-6">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">{title}</h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-plum">
            <time dateTime={guide.published}>{formatDate(guide.published, locale)}</time>
            <span>·</span>
            <span>gofal.wales</span>
          </div>
        </header>

        <div className="mt-8 prose prose-lg max-w-none text-muted-plum prose-headings:text-dusk prose-headings:font-heading prose-a:text-primary prose-strong:text-dusk prose-li:marker:text-primary">
          {content.split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) {
              return <h2 key={i} className="mt-8 mb-4 text-2xl font-bold">{block.replace("## ", "")}</h2>;
            }
            if (block.startsWith("### ")) {
              return <h3 key={i} className="mt-6 mb-3 text-xl font-bold">{block.replace("### ", "")}</h3>;
            }
            if (block.startsWith("#### ")) {
              return <h4 key={i} className="mt-4 mb-2 text-lg font-bold">{block.replace("#### ", "")}</h4>;
            }
            if (block.startsWith("- ")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ul key={i} className="my-3 list-disc pl-6 space-y-1">
                  {items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.replace(/^- /, "")) }} />
                  ))}
                </ul>
              );
            }
            if (block.startsWith("1. ")) {
              const items = block.split("\n").filter(Boolean);
              return (
                <ol key={i} className="my-3 list-decimal pl-6 space-y-1">
                  {items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.replace(/^\d+\. /, "")) }} />
                  ))}
                </ol>
              );
            }
            if (block.startsWith("---")) {
              return <hr key={i} className="my-8 border-blush-grey" />;
            }
            if (block.startsWith("*") && block.endsWith("*")) {
              return <p key={i} className="my-3 italic" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.slice(1, -1)) }} />;
            }
            return <p key={i} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block) }} />;
          })}
        </div>

        <div className="mt-12 rounded-[16px] bg-secondary p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">
            {locale === "cy"
              ? "Barod i ddechrau chwilio?"
              : "Ready to start searching?"}
          </h2>
          <Link
            href="/cartrefi-gofal"
            className="mt-4 inline-block rounded-full bg-white px-6 py-3 font-body font-bold text-secondary transition-colors hover:bg-ivory"
          >
            {locale === "cy" ? "Chwilio nawr" : "Search now"}
          </Link>
        </div>
      </article>
    </>
  );
}

function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
}
