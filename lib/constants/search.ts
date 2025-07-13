import { searchPattern } from "@/lib/types/search";

export const DEFAULT_SEARCH_PARAMS: searchPattern = {
  id: undefined,
  userId: undefined,
  searchPatternName: "新規検索パターン",
  searchPatternDescription: "",
  searchParams: {
    customerName: "", //薮田大地
    customerNameExactMatch: "exact",
    prefecture: "選択しない",
    prefectureExactMatch: "exact",
    address: "",
    addressExactMatch: "exact",
    isAdvancedSearchEnabled: false,
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
    excludeKeywords: [{
      value: "東京都",
      matchType: "exact",
    },],
    searchSites: ["facebook.com", "linkedin.com", "nikkei.com"],
    siteSearchMode: "any",
  },
  createdAt: "",
  updatedAt: "",
  lastUsedAt: "",
};