import { customsearch_v1 } from "@googleapis/customsearch";
import z from "zod";
import { keywordsSchema, matchTypeSchema, searchPatternSchema } from "../schemas/search";

// type GoogleSearchResult = customsearch_v1.Schema$Result;
export type GoogleSearchRequestResponse = customsearch_v1.Schema$Search;


// Search Parameters for API
/**
 * カスタム検索APIのパラメータ。
 * @see https://developers.google.com/custom-search/v1/cse?hl=ja#method_search.cse.list
 * @see https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list?hl=ja
 * 
 */
export type GoogleSearchRequestParams = customsearch_v1.Params$Resource$Cse$List;
export type searchPattern = z.infer<typeof searchPatternSchema>;
export type MatchType = z.infer<typeof matchTypeSchema>;
export type Keywords = z.infer<typeof keywordsSchema>;



