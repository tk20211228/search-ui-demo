'use client';

import { useCallback, useEffect } from 'react';
import { useGoogleSearch } from '@/lib/swr/use-google-search';
import { SearchParams, UISearch, initialSearchData } from './use-search';
import useSWR from 'swr';

/**
 * Google Custom Search APIを使用した検索フック
 */
export function useSearchWithAPI() {
  // ローカル状態の管理
  const { data: localSearch, mutate: setLocalSearch } = useSWR<UISearch>(
    'search-state',
    null,
    {
      fallbackData: initialSearchData,
    }
  );

  const search = localSearch || initialSearchData;

  // Google検索APIの呼び出し
  const { results, isLoading, error } = useGoogleSearch(
    search.isVisible ? search.query : null,
    {
      enabled: search.isVisible && search.query.keyword !== '',
    }
  );

  // 検索結果の更新
  useEffect(() => {
    if (search.isVisible && results) {
      setLocalSearch((current) => ({
        ...current!,
        results,
        isSearching: false,
      }));
    }
  }, [results, search.isVisible, setLocalSearch]);

  // 検索開始
  const performSearch = useCallback(
    (params: SearchParams) => {
      setLocalSearch({
        query: params,
        results: [],
        isSearching: true,
        isVisible: true,
      });
    },
    [setLocalSearch]
  );

  // 検索を閉じる
  const closeSearch = useCallback(() => {
    setLocalSearch((current) => ({
      ...current!,
      isVisible: false,
      results: [],
    }));
  }, [setLocalSearch]);

  return {
    search: {
      ...search,
      isSearching: isLoading,
    },
    performSearch,
    closeSearch,
    error,
  };
}