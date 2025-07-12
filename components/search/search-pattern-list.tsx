"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchPattern } from "@/lib/types/search-pattern";
import { SearchPatternCard } from "./search-pattern-card";

interface SearchPatternListProps {
  patterns: SearchPattern[];
}

type SortOption = "recent-activity" | "recent-created" | "alphabetical";

export function SearchPatternList({ patterns }: SearchPatternListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent-activity");

  // パターンのフィルタリングとソート
  const filteredAndSortedPatterns = useMemo(() => {
    // フィルタリング
    let filtered = patterns;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = patterns.filter((pattern) => {
        return (
          pattern.name.toLowerCase().includes(query) ||
          pattern.description?.toLowerCase().includes(query) ||
          pattern.params.customerName?.toLowerCase().includes(query) ||
          pattern.params.additionalKeywords.some((k) =>
            k.value.toLowerCase().includes(query)
          )
        );
      });
    }

    // ソート
    const sorted = [...filtered];
    switch (sortBy) {
      case "recent-activity":
        sorted.sort((a, b) => {
          const aTime = a.lastUsedAt || a.createdAt;
          const bTime = b.lastUsedAt || b.createdAt;
          return bTime.getTime() - aTime.getTime();
        });
        break;
      case "recent-created":
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "alphabetical":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "ja"));
        break;
    }

    return sorted;
  }, [patterns, searchQuery, sortBy]);

  return (
    <div className="space-y-6 px-4">
      {/* 検索とソート */}
      <div className="flex items-center relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="検索パターンを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-11"
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground">並び替え</span>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent-activity">
              最近のアクティビティ
            </SelectItem>
            <SelectItem value="recent-created">最近作成された項目</SelectItem>
            <SelectItem value="alphabetical">名前順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* パターン一覧 */}
      {filteredAndSortedPatterns.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center dark:border-muted-foreground/30">
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "検索条件に一致するパターンが見つかりません"
              : "保存された検索パターンがありません"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {filteredAndSortedPatterns.map((pattern) => (
            <SearchPatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
}
