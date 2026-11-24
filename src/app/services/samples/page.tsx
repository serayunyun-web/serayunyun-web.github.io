import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SampleBrowser } from "@/components/sample-browser";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = { title: "精裝皮革樣品", description: "瀏覽鴻萊興業精裝皮革樣品，依數位燙金、傳統燙金與系列篩選，適用論文、合約書、菜單、證書夾等所有精裝產品。" };

export default function SamplesPage() {
  return (
    <main>
      <section className="inner-image-hero samples-image-hero">
        <Image alt="精裝皮革樣品冊、皮革色票與多色精裝書封" className="inner-image-hero-media" fill priority sizes="100vw" src={withBase("/images/samples/samples-banner-desktop.webp")} />
        <div className="inner-image-hero-shade" aria-hidden="true" />
        <div className="page-container inner-image-hero-content">
          <div className="inner-image-hero-copy">
            <h1>精裝皮革樣品，<span>挑一款最對味的質感。</span></h1>
            <div className="image-page-hero-description">
              <p>適用論文、合約書、菜單、證書夾等所有精裝產品。</p>
              <p>可依數位燙金、傳統燙金與皮革系列篩選，點開色票就能看大圖。</p>
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<p className="section page-container">載入樣品分類…</p>}><SampleBrowser /></Suspense>
    </main>
  );
}
