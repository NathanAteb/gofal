"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function NotFound() {
  const { locale } = useI18n();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-dusk">
        {locale === "cy"
          ? "Mae'n ddrwg gennym — allwn ni ddim dod o hyd i'r dudalen hon."
          : "Sorry — we can't find this page."}
      </p>
      <p className="mt-2 text-muted-plum">
        {locale === "cy"
          ? "Efallai bod y dudalen wedi symud neu ddim yn bodoli mwyach."
          : "The page may have been moved or no longer exists."}
      </p>
      <p className="mt-4 italic text-muted-plum text-[15px]">
        Dim byd yma — ond mae Cymru gyfan ar gofal.wales.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-block rounded-full bg-secondary px-7 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover"
        >
          {locale === "cy" ? "Yn ôl i'r hafan" : "Back to home"}
        </Link>
        <Link
          href="/cartrefi-gofal"
          className="inline-block rounded-full border border-blush-grey bg-white px-7 py-3 font-body font-bold text-dusk transition-colors hover:bg-ivory"
        >
          {locale === "cy" ? "Chwilio" : "Search"}
        </Link>
      </div>
    </div>
  );
}
