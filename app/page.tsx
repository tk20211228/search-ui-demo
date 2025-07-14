import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-center bg-background mx-auto container">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-tight text-foreground">
            Biz Search System
          </h1>
          <p className="text-lg text-muted-foreground">
            効率的な顧客情報検索システム
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/customer-searches">
            <Button size="lg" className="min-w-[200px]">
              検索を開始
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
