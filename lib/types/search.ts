import { customsearch_v1 } from "@googleapis/customsearch";
import z from "zod";
import { additionalKeywordsSchema, matchTypeSchema, searchPatternSchema } from "../schemas/search";

export type GoogleSearchResult = customsearch_v1.Schema$Result;
export type GoogleSearchRequestResponse = customsearch_v1.Schema$Search;

// Search Parameters for API
/**
 * カスタム検索APIのパラメータ。
 * @see https://developers.google.com/custom-search/v1/cse?hl=ja#method_search.cse.list
 * @see https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list?hl=ja
 * 
 */
export type GoogleSearchRequestParams = customsearch_v1.Params$Resource$Cse$List;

export type SearchParamsOld = {
  keyword: string;
  category: string;
  dateFrom?: string;
  dateTo?: string;
  searchType: 'exact' | 'partial' | 'fuzzy';
  orKeywords?: Array<{ value: string; matchType: 'partial' | 'exact' }>;
  siteSearchMode?: 'any' | 'specific' | 'exclude';
  searchSites?: string[];
}

export type SearchParams = z.infer<typeof searchPatternSchema>;

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  date: string;
}


export type GoogleSearchResponse ={
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: GoogleSearchQuery[];
    nextPage?: GoogleSearchQuery[];
    previousPage?: GoogleSearchQuery[];
  };
  context?: {
    title: string;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items?: GoogleSearchItem[];
}

export type GoogleSearchQuery = {
  title: string;
  totalResults: string;
  searchTerms: string;
  count: number;
  startIndex: number;
  inputEncoding: string;
  outputEncoding: string;
  safe: string;
  cx: string;
  hl?: string;
}

/**
 * カスタム検索結果。
 * @see https://developers.google.com/custom-search/v1/reference/rest/v1/Search?hl=ja#Result
 */
export type GoogleSearchItem = {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    metatags?: Array<{
      [key: string]: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

// API Error Response
export interface GoogleSearchError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
    status: string;
  };
}

export type MatchType = z.infer<typeof matchTypeSchema>;
export type AdditionalKeywords = z.infer<typeof additionalKeywordsSchema>;

