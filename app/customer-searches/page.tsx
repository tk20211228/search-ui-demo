"use client";

import { useSearchPattern } from "@/lib/hooks/use-search-pattern";
import { SearchPatternHeader } from "@/components/search/search-pattern-header";
import { SearchPatternList } from "@/components/search/search-pattern-list";

export default function CustomerSearchesPage() {
  const { patterns } = useSearchPattern();

  return (
    <div className="space-y-8 mx-auto max-w-4xl px-1">
      <SearchPatternHeader />
      {/* <SearchPatternList patterns={patterns} /> */}
    </div>
  );
}
