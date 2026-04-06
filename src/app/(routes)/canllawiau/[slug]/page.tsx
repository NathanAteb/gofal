import { notFound } from "next/navigation";
import { guides } from "@/content/guides";
import { GuideContent } from "./GuideContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: "Not Found" };

  return {
    title: `${guide.title_cy} / ${guide.title_en}`,
    description: guide.excerpt_en,
    alternates: {
      languages: { cy: `/canllawiau/${slug}`, en: `/canllawiau/${slug}` },
    },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  return <GuideContent guide={guide} />;
}
