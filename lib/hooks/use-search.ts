'use client';

import { useState } from 'react';
import { useGoogleSearch } from '@/lib/swr/use-google-search';
import { SearchParamsOld, SearchResult } from '@/lib/types/search';

export interface UISearch {
  query: SearchParamsOld;
  results: SearchResult[];
  isSearching: boolean;
  isVisible: boolean;
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
};

export function useSearch() {
  const [searchParams, setSearchParams] = useState<SearchParamsOld | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // // Google Custom Search APIを使用
  // const { data, isLoading, error } = useGoogleSearch(
  //   isVisible ? searchParams : null
  // );

  // デバッグ用
  // if (error) {
  //   console.error('Search error:', error);
  // }
  // if (data) {
  //   console.log('Search data:', data);
  // }

  // Google APIの結果を変換
  // const results: SearchResult[] = data?.items ? 
  //   data.items.map((item: any, index: number) => ({
  //     id: `google-${Date.now()}-${index}`,
  //     title: item.title || '',
  //     description: item.snippet || '',
  //     url: item.link || '',
  //     category: extractCategory(item.displayLink || ''),
  //     date: extractDate(item) || new Date().toISOString(),
  //   })) : [];
  // 検索を実行 or 再検索?
  const performSearch = (params: SearchParamsOld) => {
    setSearchParams(params);
    setIsVisible(true);
  };

  const closeSearch = () => {
    setIsVisible(false);
  };

  return {
    search: {
      query: searchParams || initialSearchData.query,
      // results,
      // isSearching: isLoading,
      isVisible,
    },
    performSearch,
    closeSearch,
  };
}