import { SearchPatternHeader } from "@/components/search/search-pattern-header";
import { SearchPatternList } from "@/components/search/search-pattern-list";
import { getBaseURL } from "@/lib/utils/base-url";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: "検索パターン一覧 | Biz Search System",
  description:
    "保存された検索パターンの一覧。よく使う検索条件を保存して効率的に顧客情報を検索できます。",
};

export default function CustomerSearchesPage() {
  return (
    <div className="flex-1 space-y-8 mx-auto max-w-4xl px-1">
      <SearchPatternHeader />
      <SearchPatternList />
    </div>
  );
}
