"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleSearchRequestResponse } from "@/lib/types/search";
import { cn } from "@/lib/utils";
import { ExternalLink, RotateCcw } from "lucide-react";
import Link from "next/link";

interface SearchResultsProps {
  data?: GoogleSearchRequestResponse;
  isLoading: boolean;
  closeSearch: () => void;
}

export function SearchResults({
  data,
  isLoading,
  closeSearch,
}: SearchResultsProps) {
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
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSearch}
              title="Reset search"
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              リセット
            </Button>
          </div>
        </div>
      </div>

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
                          </h3>
                          <ExternalLink className="size-3" />
                        </Link>

                        <p className="text-sm text-foreground/80">
                          {item.displayLink || item.link}
                        </p>
                      </div>
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
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0"
                    >
                      <span className="absolute inset-0" />
                    </Link>
                  </CardContent>
                </Card>
              )
            );
          })}
        </div>
      )}

      {/* ページネーション機能 */}
      {/* {!search.isSearching && search.results.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="ghost" size="sm">
              2
            </Button>
            <Button variant="ghost" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </nav>
        </div>
      )} */}
    </div>
  );
}
