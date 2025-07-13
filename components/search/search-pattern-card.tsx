"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { searchPattern } from "@/lib/types/search";

interface SearchPatternCardProps {
  searchPattern: searchPattern;
  className?: string;
}

export function SearchPatternCard({
  searchPattern,
  className,
}: SearchPatternCardProps) {
  // パターンの概要を生成
  const getPatternSummary = () => {
    const parts = [];

    if (searchPattern.searchParams.customerName) {
      parts.push(`顧客名: ${searchPattern.searchParams.customerName}`);
    }

    if (
      searchPattern.searchParams.prefecture ||
      searchPattern.searchParams.address
    ) {
      const location = [
        searchPattern.searchParams.prefecture,
        searchPattern.searchParams.address,
      ]
        .filter(Boolean)
        .join(" ");
      if (location) parts.push(`地域: ${location}`);
    }

    if (searchPattern.searchParams.additionalKeywords.length > 0) {
      const keywords = searchPattern.searchParams.additionalKeywords
        .slice(0, 3)
        .map((k) => k.value)
        .join(", ");
      parts.push(`キーワード: ${keywords}`);
      if (searchPattern.searchParams.additionalKeywords.length > 3) {
        parts.push(
          `他${searchPattern.searchParams.additionalKeywords.length - 3}件`
        );
      }
    }

    return parts.join(" • ");
  };

  const timeAgo = searchPattern.lastUsedAt
    ? formatDistanceToNow(searchPattern.lastUsedAt, {
        addSuffix: true,
        locale: ja,
      })
    : formatDistanceToNow(searchPattern.createdAt, {
        addSuffix: true,
        locale: ja,
      });

  return (
    <Link href={`/customer-searches/${searchPattern.id}`} className="block">
      <Card
        className={cn(
          "transition-all hover:shadow-md hover:border-foreground/20 truncate",
          className
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle>{searchPattern.searchPatternName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {searchPattern.searchPatternDescription && (
            <p className="text-sm text-muted-foreground truncate">
              {searchPattern.searchPatternDescription}
            </p>
          )}
          <p className="text-xs text-muted-foreground/80">
            {getPatternSummary()}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {searchPattern.lastUsedAt ? "使用" : "作成"}: {timeAgo}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
