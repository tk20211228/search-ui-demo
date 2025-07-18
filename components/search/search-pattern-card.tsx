"use client";

import { searchPattern } from "@/lib/types/search";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
  const form = useFormContext<searchPattern>();
  const currentSearchCustomerName = form.getValues("searchParams.customerName");

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md hover:border-foreground/20 truncate relative bg-muted/50 backdrop-blur-sm",
        "!bg-muted/50",
        className
      )}
    >
      <CardHeader className="pb-3 flex items-start">
        <Link
          href={`/customer-searches/${searchPattern.id}?customerName=${currentSearchCustomerName}`}
        >
          <CardTitle>
            {searchPattern.searchPatternName}
            <span className="absolute inset-0" />
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {searchPattern.searchPatternDescription && (
          <p className="text-sm text-muted-foreground truncate">
            {searchPattern.searchPatternDescription}
          </p>
        )}
        <p className="text-xs text-muted-foreground/80 truncate">
          {getPatternSummary()}
        </p>
        <p className="text-xs text-muted-foreground/60 truncate">
          {searchPattern.lastUsedAt ? "使用" : "作成"}: {timeAgo}
        </p>
      </CardContent>
    </Card>
  );
}
