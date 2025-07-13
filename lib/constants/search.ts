import { searchPattern } from "@/lib/types/search";

export const DEFAULT_SEARCH_PARAMS: searchPattern = {
  id: undefined,
  userId: undefined,
  searchPatternName: "新規検索パターン",
  searchPatternDescription: "",
  searchParams: {
    customerName: "薮田大地",
    customerNameExactMatch: "exact",
    prefecture: "none",
    prefectureExactMatch: "exact",
    address: "",
    addressExactMatch: "exact",
    additionalKeywords: [
      {
        value: "代表取締役",
        matchType: "exact",
      },
      {
        value: "社長",
        matchType: "exact",
      },
      {
        value: "専務",
        matchType: "exact",
      },
    ],
    additionalKeywordsSearchMode: "and",
    searchSites: ["facebook.com", "linkedin.com", "nikkei.com"],
    siteSearchMode: "any",
  },
  createdAt: "",
  updatedAt: undefined,
  lastUsedAt: undefined,
};

// 部分的リセット用の定数も定義
export const DEFAULT_ADDITIONAL_KEYWORDS = DEFAULT_SEARCH_PARAMS.searchParams.additionalKeywords;
export const DEFAULT_SEARCH_SITES = DEFAULT_SEARCH_PARAMS.searchParams.searchSites;