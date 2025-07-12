import { CustomerSearchParams } from '@/lib/types/search-pattern';
import { SearchParams } from '@/lib/types/search';

/**
 * 顧客検索パラメータからGoogle検索用のクエリとSearchParamsを構築
 */
export function buildSearchQuery(formData: CustomerSearchParams): SearchParams {
  // Google検索用のクエリを構築
  let query = formData.customerNameExactMatch
    ? `"${formData.customerName}"`
    : formData.customerName;

  // 住所情報の追加
  if (
    (formData.prefecture && formData.prefecture !== 'none') ||
    formData.city
  ) {
    const addressParts = [];
    if (formData.prefecture && formData.prefecture !== 'none') {
      addressParts.push(formData.prefecture);
    }
    if (formData.city) {
      addressParts.push(formData.city);
    }
    const address = addressParts.join(' ');
    query += ` ${formData.addressExactMatch ? `"${address}"` : address}`;
  }

  // 追加キーワードの処理（AND検索の場合のみ）
  if (
    formData.additionalKeywords.length > 0 &&
    formData.keywordSearchMode === 'and'
  ) {
    const keywordQueries = formData.additionalKeywords.map((keyword) => {
      return keyword.matchType === 'exact'
        ? `"${keyword.value}"`
        : keyword.value;
    });
    query += ` ${keywordQueries.join(' ')}`;
  }

  // 検索対象サイトの処理
  if (formData.searchSites.length > 0) {
    if (formData.siteSearchMode === 'specific') {
      const siteQuery = formData.searchSites
        .map((site) => `site:${site}`)
        .join(' OR ');
      query += ` (${siteQuery})`;
    } else if (formData.siteSearchMode === 'exclude') {
      const excludeQuery = formData.searchSites
        .map((site) => `-site:${site}`)
        .join(' ');
      query += ` ${excludeQuery}`;
    }
  }

  const searchParams: SearchParams = {
    keyword: query,
    category: 'all',
    dateFrom: '',
    dateTo: '',
    searchType: formData.customerNameExactMatch ? 'exact' : 'partial',
    orKeywords:
      formData.keywordSearchMode === 'or' ? formData.additionalKeywords : [],
    siteSearchMode: formData.siteSearchMode,
    searchSites: formData.searchSites,
  };

  return searchParams;
}