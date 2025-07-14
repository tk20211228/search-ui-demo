import { SearchPatternPage } from "@/components/search/search-pattern-page";
import type { Metadata } from "next";
import { getBaseURL } from "@/lib/utils/base-url";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "検索結果 | Biz Search System",
  description:
    "顧客情報の検索結果を表示。詳細な条件で絞り込んだ顧客情報を確認できます。",
};

export default function SearchPatternDetailPage() {
  return <SearchPatternPage />;
}
