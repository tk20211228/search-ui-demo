"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchPatternHeaderProps {
  showNewButton?: boolean;
}

export function SearchPatternHeader({
  showNewButton = true,
}: SearchPatternHeaderProps) {
  return (
    <div className="flex w-full bg-bg-100 h-12 mx-auto md:h-24 md:items-end max-w-4xl shrink-0 px-1">
      <div className="flex w-full items-center justify-between gap-4 px-4 mt-6">
        <h1 className="text-3xl font-light tracking-tight text-foreground">
          Biz Search
        </h1>
        {showNewButton && (
          <Link href="/customer-searches/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規検索パターン
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
