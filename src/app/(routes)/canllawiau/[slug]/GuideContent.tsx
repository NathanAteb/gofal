"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { formatDate } from "@/lib/utils/format";
import { guides } from "@/content/guides";
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

        {/* Featured image */}
        <div className="mt-6 relative h-56 sm:h-72 rounded-[16px] overflow-hidden">
          <img
            src={guide.category === "county"
              ? "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=900&q=80&fm=webp&fit=crop"
              : "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&q=80&fm=webp&fit=crop"
            }
            alt={`${guide.title_cy} / ${guide.title_en}`}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>

        <div className="mt-8 prose prose-lg max-w-none text-muted-plum prose-headings:text-dusk prose-headings:font-heading prose-a:text-primary prose-strong:text-dusk prose-li:marker:text-primary">
          {parseMarkdownBlocks(content).map((block, i) => {
            if (block.type === "h2") return <h2 key={i} className="mt-10 mb-4 text-2xl font-bold">{block.text}</h2>;
            if (block.type === "h3") return <h3 key={i} className="mt-8 mb-3 text-xl font-bold">{block.text}</h3>;
            if (block.type === "h4") return <h4 key={i} className="mt-6 mb-2 text-lg font-semibold">{block.text}</h4>;
            if (block.type === "ul") return (
              <ul key={i} className="my-4 list-disc pl-6 space-y-2">
                {block.items!.map((item, j) => (
                  <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                ))}
              </ul>
            );
            if (block.type === "ol") return (
              <ol key={i} className="my-4 list-decimal pl-6 space-y-2">
                {block.items!.map((item, j) => (
                  <li key={j} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item) }} />
                ))}
              </ol>
            );
            if (block.type === "hr") return <hr key={i} className="my-10 border-blush-grey" />;
            return <p key={i} className="my-4 leading-[1.8]" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.text!) }} />;
          })}
        </div>

        {/* Related guides */}
        <div className="mt-10">
          <h2 className="font-heading text-xl font-bold">
            {locale === "cy" ? "Canllawiau eraill" : "Other guides"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {guides
              .filter((g) => g.slug !== guide.slug)
              .slice(0, 4)
              .map((g) => (
                <Link
                  key={g.slug}
                  href={`/canllawiau/${g.slug}`}
                  className="rounded-[12px] border border-blush-grey bg-white p-4 transition-all hover:shadow-card hover:border-primary"
                >
                  <p className="font-heading text-sm font-bold text-dusk hover:text-primary">
                    {locale === "cy" ? g.title_cy : g.title_en}
                  </p>
                </Link>
              ))}
          </div>
        </div>

        <div className="mt-10 rounded-[16px] bg-secondary p-8 text-center text-white">
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
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
}

interface Block {
  type: "h2" | "h3" | "h4" | "p" | "ul" | "ol" | "hr";
  text?: string;
  items?: string[];
}

function parseMarkdownBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // Headings
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: line.slice(5) });
      i++; continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++; continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++; continue;
    }

    // Horizontal rule
    if (line.startsWith("---")) {
      blocks.push({ type: "hr" });
      i++; continue;
    }

    // Unordered list — collect consecutive "- " lines
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list — collect consecutive "N. " lines
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("- ") && !lines[i].startsWith("---") && !/^\d+\. /.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", text: paraLines.join(" ") });
    }
  }

  return blocks;
}
