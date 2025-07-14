import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/ui/world-map";
import type { Metadata } from "next";
import { getBaseURL } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "Biz Search System - 効率的な顧客情報検索",
  description:
    "ビジネス向けの高度な顧客情報検索システム。複数の条件を組み合わせて効率的に顧客情報を検索できます。",
};

export default function Home() {
  return (
    <div className="relative h-full overflow-hidden flex-1">
      {/* 背景のWorld Map */}
      <div className="absolute inset-0">
        <div className="w-full h-full opacity-50 md:opacity-70">
          <WorldMap
            dots={[
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: 40.7128, lng: -74.006 }, // New York
              },
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: 51.5074, lng: -0.1278 }, // London
              },
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: 1.3521, lng: 103.8198 }, // Singapore
              },
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: -33.8688, lng: 151.2093 }, // Sydney
              },
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: 37.7749, lng: -122.4194 }, // San Francisco
              },
              {
                start: { lat: 23.6762, lng: 146.6503 }, // Tokyo
                end: { lat: 48.8566, lng: 2.3522 }, // Paris
              },
            ]}
            lineColor="#3b82f6"
          />
        </div>
      </div>

      {/* ブラー効果のオーバーレイ */}
      {/* <div className="absolute inset-0 backdrop-blur-sm bg-background/60" /> */}

      {/* 中央のコンテンツ */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center space-y-8 md:space-y-10 w-full max-w-lg">
          <div className="relative group">
            {/* 控えめなグラデーション効果 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur opacity-50 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative bg-background/70 dark:bg-background/50 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg border border-border/50">
              <div className="space-y-4 md:space-y-6">
                {/* タイトル */}
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
                  Biz Search System
                </h1>
                
                {/* 装飾ライン */}
                <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent"></div>
                
                {/* サブタイトル */}
                <p className="text-sm md:text-base text-muted-foreground font-light">
                  効率的な顧客情報検索システム
                </p>
              </div>

              {/* ボタン */}
              <div className="mt-6 md:mt-8">
                <Link href="/customer-searches">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto md:min-w-[200px] bg-foreground hover:bg-foreground/90 text-background transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    検索を開始
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
