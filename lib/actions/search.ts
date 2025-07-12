"use server";

import { createGoogleSearchClient } from '@/lib/google-custom-search/client';
import {
  GoogleSearchRequestParams,
  SearchParams
} from '@/lib/types/search';

export async function googleSearch(formData: SearchParams) {
  const customSearch = await createGoogleSearchClient();
  const USER_INTERFACE_LANGUAGE = "ja";
  const MAX_RESULTS = 10;
  // APIパラメータの構築
  const searchParams: GoogleSearchRequestParams = {
    q: formData.searchParams.customerName,
    cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID!,
    num: MAX_RESULTS,
  };

  // // OR検索キーワードの処理
  // if (params.orKeywords && params.orKeywords.length > 0) {
  //   searchParams.orTerms = params.orKeywords
  //     .map(k => k.matchType === 'exact' ? `"${k.value}"` : k.value)
  //     .join(' ');
  // }

  // // サイト検索の処理（Google APIの制限により、単一サイトのみ指定可能）
  // if (params.searchSites && params.searchSites.length > 0 && params.siteSearchMode === 'specific') {
  //   searchParams.siteSearch = params.searchSites[0];
  //   searchParams.siteSearchFilter = 'i';
  // }

  // const response = await customSearch.cse.list(searchParams);
  const response = {
    data: formData,
  };
  console.log("response", response);
  return response.data;
}