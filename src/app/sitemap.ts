import { MetadataRoute } from "next";
import { counties } from "@/lib/utils/counties";
import { guides } from "@/content/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gofal.wales";

  const staticPages = [
    "",
    "/cartrefi-gofal",
    "/canllawiau",
    "/amdanom",
    "/cysylltu",
    "/darparwyr",
    "/preifatrwydd",
    "/telerau",
    "/cwcis",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const countyPages = counties.map((county) => ({
    url: `${baseUrl}/cartrefi-gofal/${county.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const guidePages = guides.map((guide) => ({
    url: `${baseUrl}/canllawiau/${guide.slug}`,
    lastModified: new Date(guide.published),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...countyPages, ...guidePages];
}
