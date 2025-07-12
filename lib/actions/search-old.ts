'use server';

import { GoogleSearchResponse, GoogleSearchParams, GoogleSearchError } from '@/lib/types/search';
import { SearchParams, SearchResult } from '@/lib/types/search';

/**
 * Google Custom Search APIを使用して検索を実行
 */
export async function searchGoogle(params: SearchParams): Promise<SearchResult[]> {
  try {
    // 環境変数のチェック
    if (!process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || !process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) {
      console.error('Missing Google Custom Search API credentials');
      // 開発環境ではモックデータを返す
      return getMockResults(params);
    }

    // APIパラメータの構築
    const searchParams: GoogleSearchParams = {
      q: params.keyword,
      key: process.env.GOOGLE_CUSTOM_SEARCH_API_KEY,
      cx: process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
      hl: 'ja', // 日本語結果を優先
      num: 10, // 結果数
    };

    // OR検索キーワードの処理
    if (params.orKeywords && params.orKeywords.length > 0) {
      const orTerms = params.orKeywords
        .map(k => k.matchType === 'exact' ? `"${k.value}"` : k.value)
        .join(' ');
      searchParams.orTerms = orTerms;
    }

    // サイト検索の処理
    if (params.searchSites && params.searchSites.length > 0 && params.siteSearchMode !== 'any') {
      if (params.siteSearchMode === 'specific') {
        // 特定サイトのみ検索（最初のサイトのみ指定可能）
        searchParams.siteSearch = params.searchSites[0];
        searchParams.siteSearchFilter = 'i';
      } else if (params.siteSearchMode === 'exclude') {
        // サイトを除外（クエリに含める）
        searchParams.q += ' ' + params.searchSites.map(site => `-site:${site}`).join(' ');
      }
    }

    // URLの構築
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });

    // APIリクエスト
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!response.ok) {
      const error: GoogleSearchError = await response.json();
      console.error('Google Search API error:', error);
      throw new Error(error.error.message);
    }

    const data: GoogleSearchResponse = await response.json();

    // 検索結果をアプリケーションの形式に変換
    return convertGoogleResults(data);

  } catch (error) {
    console.error('Search error:', error);
    // エラー時はモックデータを返す
    return getMockResults(params);
  }
}

/**
 * Google検索結果をアプリケーションの形式に変換
 */
function convertGoogleResults(data: GoogleSearchResponse): SearchResult[] {
  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((item, index) => ({
    id: `google-${Date.now()}-${index}`,
    title: item.title,
    description: item.snippet,
    url: item.link,
    category: extractCategory(item),
    date: extractDate(item) || new Date().toISOString(),
  }));
}

/**
 * 検索結果からカテゴリを抽出（ドメインベース）
 */
function extractCategory(item: any): string {
  const domain = item.displayLink;
  
  if (domain.includes('facebook.com')) return 'Social Media';
  if (domain.includes('linkedin.com')) return 'Professional';
  if (domain.includes('wantedly.com')) return 'Recruitment';
  if (domain.includes('pr-times.jp')) return 'Press Release';
  if (domain.includes('nikkei.com')) return 'News';
  
  return 'Web';
}

/**
 * 検索結果から日付を抽出（メタデータから）
 */
function extractDate(item: any): string | null {
  // pagemap内のメタデータから日付を探す
  if (item.pagemap?.metatags?.[0]) {
    const metatags = item.pagemap.metatags[0];
    return metatags['article:published_time'] || 
           metatags['datePublished'] || 
           metatags['date'] ||
           null;
  }
  return null;
}

/**
 * モックデータを生成（開発/エラー時用）
 */
function getMockResults(params: SearchParams): SearchResult[] {
  const categories = ['Social Media', 'Professional', 'News', 'Press Release', 'Web'];
  return Array.from({ length: 10 }, (_, i) => ({
    id: `mock-${Date.now()}-${i}`,
    title: `${params.keyword} - 検索結果 ${i + 1}`,
    description: `「${params.keyword}」に関する検索結果です。この結果は開発用のモックデータです。`,
    url: `https://example.com/${params.keyword.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    category: categories[i % categories.length],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
}