import { GoogleSearchRequestParams, searchPattern, Keywords } from "../types/search";

/**
 * キーワードを検索クエリ用にフォーマットする
 * @param value キーワード文字列
 * @param matchType マッチタイプ（完全一致/部分一致）
 * @returns フォーマット済みのキーワード文字列
 */
const formatKeyword = (value: string, matchType: 'exact' | 'partial'): string => {
  return matchType === 'exact' ? `"${value}"` : value;
};

/**
 * 複数サイトの検索クエリを構築する
 * @param sites サイトのリスト
 * @param mode 検索モード
 * @returns サイト検索用のクエリ文字列
 */
const buildMultipleSiteQuery = (sites: string[], mode: 'specific' | 'exclude'): string => {
  if (mode === 'specific') {
    // OR検索の場合は括弧で囲む
    return `(${sites.map(site => `site:${site}`).join(' OR ')})`;
  } else {
    // 除外の場合は各サイトに-を付ける
    return sites.map(site => `-site:${site}`).join(' ');
  }
};

/**
 * Google Custom Search APIのパラメータを生成する
 * @param parsedData 検索パターンデータ
 * @param start ページネーション用の開始位置
 * @returns Google検索APIパラメータ
 */
export const generateGoogleSearchParams = (parsedData: searchPattern, start: number = 1): GoogleSearchRequestParams => {
  const MAX_RESULTS = 10;
  const { searchParams } = parsedData;
  const { 
    customerName, customerNameExactMatch,
    prefecture, prefectureExactMatch,
    address, addressExactMatch,
    additionalKeywords, additionalKeywordsSearchMode,
    excludeKeywords,
    searchSites, siteSearchMode
  } = searchParams;

  // 基本検索クエリの構築
  const queryParts: string[] = [];
  
  // 顧客名
  queryParts.push(formatKeyword(customerName, customerNameExactMatch));
  
  // 都道府県
  if (prefecture && prefecture !== '選択しない') {
    queryParts.push(formatKeyword(prefecture, prefectureExactMatch));
  }
  
  // 市区町村以降
  if (address) {
    queryParts.push(formatKeyword(address, addressExactMatch));
  }

  // 追加キーワードの処理
  let orTerms: string | undefined;
  if (additionalKeywords.length > 0) {
    if (additionalKeywordsSearchMode === "and") {
      // AND検索: メインクエリに追加
      const andKeywords = additionalKeywords.map(keyword => 
        formatKeyword(keyword.value, keyword.matchType)
      );
      queryParts.push(...andKeywords);
    } else if (additionalKeywordsSearchMode === "or") {
      // OR検索: orTermsパラメータを使用
      orTerms = additionalKeywords
        .map(keyword => formatKeyword(keyword.value, keyword.matchType))
        .join("|");
    }
  }

  // 除外キーワードの処理
  let excludeTerms: string | undefined;
  if (excludeKeywords.length > 0) {
    excludeTerms = excludeKeywords
      .map(keyword => formatKeyword(keyword.value, keyword.matchType))
      .join(" ");
  }

  // Google検索パラメータの初期化
  const googleSearchParams: GoogleSearchRequestParams = {
    q: queryParts.join(' '),
    cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID!,
    num: MAX_RESULTS,
    start: start,
  };

  // サイト検索の処理
  if (searchSites.length > 0 && siteSearchMode !== 'any') {
    if (searchSites.length === 1) {
      // 単一サイト: API パラメータを使用
      googleSearchParams.siteSearch = searchSites[0];
      googleSearchParams.siteSearchFilter = siteSearchMode === 'specific' ? 'i' : 'e';
    } else {
      // 複数サイト: クエリに追加
      const siteQuery = buildMultipleSiteQuery(searchSites, siteSearchMode);
      googleSearchParams.q = `${googleSearchParams.q} ${siteQuery}`.trim();
    }
  }

  // オプションパラメータの追加
  if (orTerms) {
    googleSearchParams.orTerms = orTerms;
  }
  if (excludeTerms) {
    googleSearchParams.excludeTerms = excludeTerms;
  }

  return googleSearchParams;
}