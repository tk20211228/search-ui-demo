'use client';

import {  GoogleSearchRequestResponse, searchPattern } from "@/lib/types/search";
import useSWR from "swr";
import { googleSearch } from "../actions/search";
import { customsearch_v1 } from "@googleapis/customsearch";
import { ZodError } from "zod";
import { generateGoogleSearchParams } from "../utils/search";

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
  // if (formData) {
  //   formData.lastUsedAt = new Date().toISOString();
  // }
  

  // console.log("formData",formData!)
  const GoogleSearchParams = formData ? generateGoogleSearchParams(formData, start) : null;
  const key = formData && enabled ? ['google-search', GoogleSearchParams] : null;
  // const key = formData && enabled ? `api/google-search/${formData.id}?customerName=${customerName}` : null;


  const { data, error, isLoading, isValidating, mutate } = useSWR<GoogleSearchRequestResponse , Error>(
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
  console.log("data", data);

  return {
    data,
    error,
    isLoading, // データ取得中かどうか
    isValidating, // データが有効かどうか
    mutate, // データを更新
  };
}