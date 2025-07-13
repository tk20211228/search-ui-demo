"use server";

import { createGoogleSearchClient } from '@/lib/google-custom-search/client';
import {
  searchPattern
} from '@/lib/types/search';
import { searchPatternSchema } from '../schemas/search';
import { generateGoogleSearchParams } from '../utils/search';

export async function googleSearch(formData: searchPattern, start: number = 1) {

  const parsed = searchPatternSchema.safeParse(formData);
  if (!parsed.success) {
    console.log("Invalid form data", parsed.error);
    throw new Error("Invalid form data");
  }
  const GoogleSearchParams = generateGoogleSearchParams(parsed.data, start);
  const customSearch = await createGoogleSearchClient();
  console.log("GoogleSearchParams＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝", GoogleSearchParams);

  const response = await customSearch.cse.list(GoogleSearchParams);
  console.log("response", response.data.searchInformation);

  return response.data;
}

