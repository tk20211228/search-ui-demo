'use client';

import { searchPattern } from "@/lib/types/search";
import useSWR from "swr";
import { googleSearch } from "../actions/search";

interface UseGoogleSearchOptions {
  enabled?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  dedupingInterval?: number;
}

export function useGoogleSearch(
  formData: searchPattern | null,
  options: UseGoogleSearchOptions = {}
) {
  const {
    enabled = true,                // デフォルトでは有効
    revalidateOnFocus = false,     // デフォルトではフォーカス時に再検証しない
    revalidateOnReconnect = false, // デフォルトでは再接続時に再検証しない
    dedupingInterval = 5000,       // デフォルトでは5秒ごとに重複排除
  } = options;
  const key = formData && enabled ? ['google-search', formData] : null;
  // const key = formData && enabled ? 'api/google-search' : null;


  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => googleSearch(formData!),
    {
      revalidateOnFocus,
      revalidateOnReconnect,
      dedupingInterval,
      errorRetryCount: 2, // 最大2回リトライ
      errorRetryInterval: 5000, // 5秒ごとにリトライ
      keepPreviousData: true, // 新しいデータを取得中も前のデータを保持
    }
  );

  return {
    data,
    error,
    isLoading, // データ取得中かどうか
    isValidating, // データが有効かどうか
    mutate, // データを更新
  };
}