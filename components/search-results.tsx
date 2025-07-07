'use client';

import { ExternalLink, Calendar, Tag, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/use-search';
import { cn } from '@/lib/utils';

export function SearchResults() {
  const { search, closeSearch } = useSearch();

  if (!search.isVisible || (!search.isSearching && search.results.length === 0)) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      <div className="sticky top-0 bg-white dark:bg-neutral-950 pb-6 -mt-8 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light">
              Search Results
              {!search.isSearching && (
                <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                  ({search.results.length} found)
                </span>
              )}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Showing results for &quot;{search.query.keyword}&quot;
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSearch}
            title="Close search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {search.isSearching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {search.results.map((result) => (
            <Card
              key={result.id}
              className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                "hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium hover:underline">
                      {result.title}
                    </h3>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 inline-flex items-center gap-1"
                    >
                      {result.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {result.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{result.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(result.date)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!search.isSearching && search.results.length > 0 && (
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
      )}
    </div>
  );
}