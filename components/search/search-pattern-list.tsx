"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchPattern } from "@/lib/types/search";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { SearchPatternCard } from "./search-pattern-card";

export function SearchPatternList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPatterns, setSearchPatterns] = useLocalStorageState<
    searchPattern[]
  >("searchPatterns-new", {
    defaultValue: [],
  });

  const [sortBy, setSortBy] = useState<string>("recent-activity");

  const filteredAndSortedPatterns = useMemo(() => {
    const filtered = searchPatterns.filter((pattern) =>
      pattern.searchPatternName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent-activity":
          return (
            new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
          );
        case "recent-created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "alphabetical":
          return a.searchPatternName.localeCompare(b.searchPatternName);
        default:
          return 0;
      }
    });
  }, [searchPatterns, searchQuery, sortBy]);
  const handleSortBy = (value: string) => {
    setSortBy(value);
  };

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
        <Select value={sortBy} onValueChange={handleSortBy}>
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
            <SearchPatternCard key={pattern.id} searchPattern={pattern} />
          ))}
        </div>
      )}
    </div>
  );
}
