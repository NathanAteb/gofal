import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import { I18nProvider } from "@/lib/i18n/context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gofal.wales"),
  title: {
    default: "gofal.wales — Cartrefi Gofal yng Nghymru",
    template: "%s — gofal.wales",
  },
  description:
    "Cyfeiriadur cartrefi gofal Cymraeg cyntaf Cymru. Dewch o hyd i'r cartref gofal gorau i'ch anwyliaid gyda gwybodaeth CIW, prisiau, a chefnogaeth Gymraeg.",
  openGraph: {
    type: "website",
    locale: "cy_GB",
    alternateLocale: "en_GB",
    siteName: "gofal.wales",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      cy: "https://gofal.wales",
      en: "https://gofal.wales",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cy" className={`${poppins.variable} ${nunito.variable}`}>
      <body className="min-h-screen bg-ivory text-dusk antialiased">
        <I18nProvider>
          <Header />
          <main className="min-h-[calc(100vh-160px)]">{children}</main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
