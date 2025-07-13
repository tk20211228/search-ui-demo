"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleSearchRequestResponse } from "@/lib/types/search";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResultsProps {
  data?: GoogleSearchRequestResponse;
  isLoading: boolean;
  closeSearch: () => void;
  handlePageChange: (newStart: number) => void;
  currentStart: number;
  error?: Error; // エラープロパティを追加
}

export function SearchResults({
  data,
  isLoading,
  closeSearch,
  handlePageChange,
  currentStart,
  error,
}: SearchResultsProps) {
  // ページネーション情報の計算
  const resultsPerPage = 10;
  const currentPage = Math.ceil(currentStart / resultsPerPage);
  const totalResults = data?.searchInformation?.totalResults
    ? parseInt(data.searchInformation.totalResults)
    : 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Google Custom Search APIの制限について：
  // - 最大100件の結果まで取得可能（start=91, num=10が最後のページ）
  // - start=101以降は「Request contains an invalid argument」エラーが発生
  // - 実際のテストでもstart=101でエラーが確認されている
  const maxPages = Math.min(totalPages, 10); // 10ページまでに制限

  // ページネーションのページ番号を生成
  const getPageNumbers = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(maxPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newStart = (currentPage - 2) * resultsPerPage + 1;
      handlePageChange(newStart);
    }
  };

  const handleNextPage = () => {
    if (currentPage < maxPages) {
      const newStart = currentPage * resultsPerPage + 1;
      handlePageChange(newStart);
    }
  };

  const handlePageClick = (page: number) => {
    const newStart = (page - 1) * resultsPerPage + 1;
    handlePageChange(newStart);
  };

  const handlePaginationClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  // API制限に関するチェック
  const isNearApiLimit = currentStart > 80; // 8ページ目以降で警告
  const isPastApiLimit = currentStart > 100; // 10ページ目以降（実際にはエラーになる）

  return (
    <div className="w-full" data-search-results>
      <div className="sticky top-0 pb-6 -mt-8 pt-8 z-10 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              検索結果
              <span className="text-sm text-muted-foreground ml-2">
                ({data?.searchInformation?.formattedTotalResults} 件)
              </span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              検索項目：{data?.queries?.request?.[0].searchTerms}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              除外項目：{data?.queries?.request?.[0].excludeTerms}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSearch}
              title="Reset search"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </div>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mb-4 p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-sm">⚠️</span>
            <div>
              <p className="text-sm font-medium">検索でエラーが発生しました</p>
              <p className="text-xs text-red-600 mt-1">
                {isPastApiLimit
                  ? "Google Custom Search APIの制限により、これ以上の結果を取得できません。検索条件を絞り込んでください。"
                  : error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API制限警告 */}
      {isNearApiLimit && !error && (
        <div className="mb-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-2 text-yellow-700">
            <span className="text-sm">💡</span>
            <p className="text-sm">
              Google Custom Search
              APIの制限に近づいています。10ページ目以降は結果を取得できません。
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.items?.map((item, index) => {
            const image: string | undefined =
              item.pagemap?.cse_image?.[0]?.src ||
              item.pagemap?.cse_thumbnail?.[0]?.src ||
              item.pagemap?.metatags?.[0]?.["og:image"];
            return (
              item.link && (
                <Card
                  key={index}
                  className={cn(
                    "transition-all hover:shadow-md cursor-pointer",
                    "hover:border-muted-foreground/30",
                    "relative"
                  )}
                >
                  <CardContent className="p-6 flex gap-4">
                    <div className="space-y-3 flex justify-between w-full">
                      <div className="space-y-3">
                        <div>
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4"
                          >
                            <h3 className="text-lg font-medium hover:underline inline-flex items-center gap-1">
                              {item.title}
                              <span className="absolute inset-0" />
                            </h3>
                            <ExternalLink className="size-3" />
                          </Link>
                        </div>
                        <p className="text-sm text-foreground/80">
                          {item.displayLink || item.link}
                        </p>
                        <div
                          className={cn(
                            "prose prose-sm max-w-none",
                            "dark:prose-invert",
                            "line-clamp-3"
                          )}
                          dangerouslySetInnerHTML={{
                            __html: item.htmlSnippet || item.snippet || "",
                          }}
                        />
                      </div>
                    </div>

                    {image && (
                      <img
                        src={image}
                        alt={item.title || "Search result image"}
                        className={`aspect-video object-cover rounded-md h-35 
                        border-muted-foreground/20 border                       
                          `}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              )
            );
          })}
        </div>
      )}

      {/* ページネーション機能 */}
      {!isLoading && data?.items && data.items.length > 0 && maxPages > 1 && (
        <div className="mt-8 space-y-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => handlePaginationClick(e, handlePreviousPage)}
                  className={cn(
                    "cursor-pointer",
                    currentPage <= 1 && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={currentPage <= 1}
                />
              </PaginationItem>

              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) =>
                      handlePaginationClick(e, () => handlePageClick(page))
                    }
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < maxPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => handlePaginationClick(e, handleNextPage)}
                  className={cn(
                    "cursor-pointer",
                    currentPage >= maxPages && "opacity-50 cursor-not-allowed"
                  )}
                  aria-disabled={currentPage >= maxPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Google Custom Search APIの制限に関する説明 */}
          {currentPage >= maxPages && totalResults > 100 && (
            <div className="text-center text-sm text-muted-foreground">
              <p>
                💡 Google Custom Search
                APIの制限により、最大100件（10ページ）までの結果を表示しています。
                <br />
                より多くの結果を確認するには、検索条件を絞り込んでください。
              </p>
            </div>
          )}

          {/* 結果数の表示 */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              {currentStart}件目～
              {Math.min(currentStart + resultsPerPage - 1, totalResults)}件目
              （全{data?.searchInformation?.formattedTotalResults}件中）
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
