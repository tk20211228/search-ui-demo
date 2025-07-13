"use client";

import { SearchPattern } from "@/lib/types/search-pattern";
import { SearchPatternCard } from "./search-pattern-card";
import { useSearch } from "../providers/search";
import useLocalStorageState from "use-local-storage-state";
import { searchPattern } from "@/lib/types/search";

export function RelatedPatterns() {
  const [searchPatterns] = useLocalStorageState<searchPattern[] | []>(
    "searchPatterns-new",
    {
      defaultValue: [],
    }
  );

  return (
    <div className="space-y-4 w-72 m-4 pb-14">
      {searchPatterns.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-muted-foreground">
            他の検索パターン
          </h3>
          {searchPatterns.map((searchPattern) => (
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
