"use server";

import { createGoogleSearchClient } from '@/lib/google-custom-search/client';
import {
  searchPattern,
  GoogleSearchRequestResponse
} from '@/lib/types/search';
import { searchPatternSchema } from '../schemas/search';
import { generateGoogleSearchParams } from '../utils/search';
import { checkRateLimit, createRateLimitError } from '@/lib/rate-limit';
import type { SearchResponseWithRateLimit } from '@/lib/types/rate-limit';

export async function googleSearch(formData: searchPattern, start: number = 1): Promise<SearchResponseWithRateLimit<GoogleSearchRequestResponse>> {
  try {
    // レート制限チェック
    const rateLimitResult = await checkRateLimit('global');
    
    if (!rateLimitResult.allowed) {
      const error = createRateLimitError(rateLimitResult.status, rateLimitResult.retryAfter);
      return {
        error: error.message,
        rateLimitStatus: rateLimitResult.status,
      };
    }

    const parsed = searchPatternSchema.safeParse(formData);
    if (!parsed.success) {
      console.log("Invalid form data", parsed.error);
      return {
        error: "Invalid form data",
        rateLimitStatus: rateLimitResult.status,
      };
    }
    
    const GoogleSearchParams = generateGoogleSearchParams(parsed.data, start);
    const customSearch = await createGoogleSearchClient();

    const response = await customSearch.cse.list(GoogleSearchParams);
    console.log("response", response);
    // console.log("response", response.data.searchInformation);

    return {
      data: response.data,
      rateLimitStatus: rateLimitResult.status,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      error: error instanceof Error ? error.message : "検索中にエラーが発生しました",
    };
  }
}

