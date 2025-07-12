import useSWR from 'swr';
import { SearchParams, SearchResult } from '@/lib/types/search';
import { searchGoogle } from '@/lib/actions/search-old';

interface UseGoogleSearchOptions {
  enabled?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number;
}

/**
 * Google Custom Search APIを使用した検索のカスタムフック
 */
export function useGoogleSearch(
  params: SearchParams | null,
  options: UseGoogleSearchOptions = {}
) {
  const {
    enabled = true,
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    dedupingInterval = 5000,
  } = options;

  // パラメータが有効な場合のみキーを生成
  const key = params && enabled ? ['google-search', params] : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<SearchResult[], Error>(
    key,
    () => searchGoogle(params!),
    {
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval,
      errorRetryCount: 2,
      errorRetryInterval: 5000,
      keepPreviousData: true, // 新しいデータを取得中も前のデータを保持
    }
  );

  return {
    results: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    isEmpty: !isLoading && (!data || data.length === 0),
  };
}

/**
 * 検索結果のプリフェッチ
 */
export async function prefetchGoogleSearch(params: SearchParams) {
  const key = ['google-search', params];
  
  try {
    const results = await searchGoogle(params);
    // SWRのキャッシュに手動で設定
    if (typeof window !== 'undefined') {
      const { mutate } = await import('swr');
      mutate(key, results, false);
    }
    return results;
  } catch (error) {
    console.error('Prefetch error:', error);
    return [];
  }
}