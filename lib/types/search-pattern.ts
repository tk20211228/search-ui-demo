import { SimpleTagWithMatch } from '@/components/ui/tag-input-elegant';

export interface SearchPattern {
  id: string;
  userId: string;
  name: string;
  description?: string;
  params: CustomerSearchParams;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
}

export interface CustomerSearchParams {
  customerName: string;
  customerNameExactMatch: boolean;
  prefecture: string;
  city: string;
  addressExactMatch: boolean;
  additionalKeywords: SimpleTagWithMatch[];
  keywordSearchMode: 'and' | 'or';
  searchSites: string[];
  siteSearchMode: 'any' | 'specific' | 'exclude';
}