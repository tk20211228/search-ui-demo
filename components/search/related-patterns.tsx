"use client";

import { SearchPattern } from "@/lib/types/search-pattern";
import { SearchPatternCard } from "./search-pattern-card";

interface RelatedPatternsProps {
  patterns?: SearchPattern[];
}

export function RelatedPatterns({ patterns = [] }: RelatedPatternsProps) {
  return (
    <div className="space-y-4 w-72 m-4 pb-14">
      {patterns.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-muted-foreground">
            他の検索パターン
          </h3>
          {patterns.map((pattern) => (
            <SearchPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </>
      )}
    </div>
  );
}
