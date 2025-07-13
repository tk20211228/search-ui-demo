"use client";

import { searchPattern } from "@/lib/types/search";
import useLocalStorageState from "use-local-storage-state";
import { SearchPatternCard } from "./search-pattern-card";

export function RelatedPatterns() {
  const [searchPatterns] = useLocalStorageState<searchPattern[] | []>(
    "searchPatterns",
    {
      defaultValue: [],
    }
  );

  const sortedSearchPatterns = [...searchPatterns].sort((a, b) => {
    // lastUsedAtがundefinedの場合は、一番古いものとして扱う
    const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
    const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div className="space-y-4 w-72 m-4 pb-14">
      {searchPatterns.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-muted-foreground">
            他の検索パターン
          </h3>
          {sortedSearchPatterns.map((searchPattern) => (
            <SearchPatternCard
              key={searchPattern.id}
              searchPattern={searchPattern}
            />
          ))}
        </>
      )}
    </div>
  );
}
