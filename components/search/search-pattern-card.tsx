"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { SearchPattern } from "@/lib/types/search-pattern";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SearchPatternCardProps {
  pattern: SearchPattern;
  className?: string;
}

export function SearchPatternCard({
  pattern,
  className,
}: SearchPatternCardProps) {
  // パターンの概要を生成
  const getPatternSummary = () => {
    const parts = [];

    if (pattern.params.customerName) {
      parts.push(`顧客名: ${pattern.params.customerName}`);
    }

    if (pattern.params.prefecture || pattern.params.city) {
      const location = [pattern.params.prefecture, pattern.params.city]
        .filter(Boolean)
        .join(" ");
      if (location) parts.push(`地域: ${location}`);
    }

    if (pattern.params.additionalKeywords.length > 0) {
      const keywords = pattern.params.additionalKeywords
        .slice(0, 3)
        .map((k) => k.value)
        .join(", ");
      parts.push(`キーワード: ${keywords}`);
      if (pattern.params.additionalKeywords.length > 3) {
        parts.push(`他${pattern.params.additionalKeywords.length - 3}件`);
      }
    }

    return parts.join(" • ");
  };

  const timeAgo = pattern.lastUsedAt
    ? formatDistanceToNow(pattern.lastUsedAt, { addSuffix: true, locale: ja })
    : formatDistanceToNow(pattern.createdAt, { addSuffix: true, locale: ja });

  return (
    <Link href={`/customer-searches/${pattern.id}`} className="block">
      <Card
        className={cn(
          "transition-all hover:shadow-md hover:border-foreground/20 truncate",
          className
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle>{pattern.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pattern.description && (
            <p className="text-sm text-muted-foreground truncate">
              {pattern.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/80">
            {getPatternSummary()}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {pattern.lastUsedAt ? "使用" : "作成"}: {timeAgo}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
