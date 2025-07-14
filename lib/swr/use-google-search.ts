'use client';

import { GoogleSearchRequestResponse, searchPattern } from "@/lib/types/search";
import type { SearchResponseWithRateLimit } from "@/lib/types/rate-limit";
import useSWR from "swr";
import { googleSearch } from "../actions/search";
import { generateGoogleSearchParams } from "../utils/search";
import { toast } from "sonner";
import { useEffect } from "react";

interface UseGoogleSearchOptions {
  enabled?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number;
}

export function useGoogleSearch(
  formData: searchPattern | null,
  start: number = 1,
  options: UseGoogleSearchOptions = {}
) {
  const {
    enabled = true,                // デフォルトでは有効
    revalidateOnFocus = false,     // デフォルトではフォーカス時に再検証しない
    revalidateOnReconnect = false, // デフォルトでは再接続時に再検証しない
    dedupingInterval = 3 * 60 * 60 * 1000, // 3時間 (10,800,000ms) でデータ保持
  } = options;
  
  const GoogleSearchParams = formData ? generateGoogleSearchParams(formData, start) : null;
  const key = formData && enabled ? ['google-search', GoogleSearchParams] : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<SearchResponseWithRateLimit<GoogleSearchRequestResponse>, Error>(
    key,
    () => googleSearch(formData!, start),
    {
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval,
      errorRetryCount: 2, // 最大2回リトライ
      errorRetryInterval: 5000, // 5秒ごとにリトライ
      keepPreviousData: true, // 新しいデータを取得中も前のデータを保持
    }
  );
  
  // レート制限の通知
  useEffect(() => {
    if (data?.rateLimitStatus) {
      const { remaining } = data.rateLimitStatus;
      
      // 警告通知（残り200回以下）
      if (remaining <= 200 && remaining > 0) {
        toast.warning(`API使用制限の警告: 残り${remaining}回`, {
          description: '使用制限に近づいています。',
        });
      }
      
      // エラー通知（制限到達）
      if (remaining === 0) {
        toast.error('API使用制限に到達しました', {
          description: `次回リセット: ${new Date(data.rateLimitStatus.resetAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
        });
      }
    }
    
    // APIエラーの通知
    if (data?.error) {
      toast.error('検索エラー', {
        description: data.error,
      });
    }
  }, [data]);

  // console.log("data", data);

  return {
    data: data?.data,
    error: error || (data?.error ? new Error(data.error) : null),
    isLoading,
    isValidating,
    mutate,
    rateLimitStatus: data?.rateLimitStatus,
  };
}