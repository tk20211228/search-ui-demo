'use client';

import useSWR from 'swr';
import { useCallback, useMemo } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date: string;
}

export interface SearchParams {
  keyword: string;
  category: string;
  dateFrom?: string;
  dateTo?: string;
  searchType: 'exact' | 'partial' | 'fuzzy';
}

export interface UISearch {
  query: SearchParams;
  results: SearchResult[];
  isSearching: boolean;
  isVisible: boolean;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export const initialSearchData: UISearch = {
  query: {
    keyword: '',
    category: 'all',
    searchType: 'partial',
  },
  results: [],
  isSearching: false,
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

export function useSearch() {
  const { data: localSearch, mutate: setLocalSearch } = useSWR<UISearch>(
    'search',
    null,
    {
      fallbackData: initialSearchData,
    }
  );

  const search = useMemo(() => {
    if (!localSearch) return initialSearchData;
    return localSearch;
  }, [localSearch]);

  const setSearch = useCallback(
    (updaterFn: UISearch | ((currentSearch: UISearch) => UISearch)) => {
      setLocalSearch((currentSearch) => {
        const searchToUpdate = currentSearch || initialSearchData;

        if (typeof updaterFn === 'function') {
          return updaterFn(searchToUpdate);
        }

        return updaterFn;
      });
    },
    [setLocalSearch]
  );

  const performSearch = useCallback(
    async (params: SearchParams) => {
      setSearch((current) => ({
        ...current,
        query: params,
        isSearching: true,
        isVisible: true,
      }));

      // モックデータ生成（実際のAPIに置き換え可能）
      const categories = ['Technology', 'Business', 'Design', 'Marketing', 'Development'];
      const mockResults: SearchResult[] = Array.from({ length: 10 }, (_, i) => ({
        id: `result-${i + 1}`,
        title: `${params.keyword} - Result ${i + 1}`,
        description: `This is a detailed description for search result ${i + 1} matching "${params.keyword}". It contains relevant information about the topic and provides useful insights.`,
        url: `https://example.com/${params.keyword.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
        category: categories[i % categories.length],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      // フィルタリング
      let filteredResults = mockResults;

      if (params.category !== 'all') {
        filteredResults = filteredResults.filter(r => r.category.toLowerCase() === params.category);
      }

      if (params.dateFrom) {
        filteredResults = filteredResults.filter(r => new Date(r.date) >= new Date(params.dateFrom!));
      }

      if (params.dateTo) {
        filteredResults = filteredResults.filter(r => new Date(r.date) <= new Date(params.dateTo!));
      }

      // 遅延をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSearch((current) => ({
        ...current,
        results: filteredResults,
        isSearching: false,
      }));
    },
    [setSearch]
  );

  const closeSearch = useCallback(() => {
    setSearch((current) => ({
      ...current,
      isVisible: false,
      results: [],
    }));
  }, [setSearch]);

  return useMemo(
    () => ({
      search,
      setSearch,
      performSearch,
      closeSearch,
    }),
    [search, setSearch, performSearch, closeSearch]
  );
}