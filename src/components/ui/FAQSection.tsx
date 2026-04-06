"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

interface FAQ {
  question_cy: string;
  question_en: string;
  answer_cy: string;
  answer_en: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  pageUrl: string;
}

export function FAQSection({ faqs, pageUrl }: FAQSectionProps) {
  const { locale } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "cy" ? faq.question_cy : faq.question_en,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "cy" ? faq.answer_cy : faq.answer_en,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          const question = locale === "cy" ? faq.question_cy : faq.question_en;
          const answer = locale === "cy" ? faq.answer_cy : faq.answer_en;

          return (
            <div
              key={i}
              className="rounded-[16px] border border-blush-grey bg-white"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-heading font-bold text-dusk pr-4">
                  {question}
                </span>
                <svg
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <div className="border-t border-blush-grey px-4 pb-4 pt-3 text-sm text-muted-plum leading-relaxed">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
