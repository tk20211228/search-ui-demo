import { z } from "zod";
import { prefectures } from "../data/search";

export const matchTypeSchema = z.enum(['exact', 'partial']);
export const additionalKeywordsSchema = z.object({
  value: z.string(),
  matchType: matchTypeSchema,
})

export const searchModeSchema = z.enum(['and', 'or']);

export const nameSchema = z.string().trim()
  .min(1, { message: "1文字以上入力してください" })
  .max(256, { message: "256文字以内で入力してください" });

export const searchParamsSchema = z.object({
  customerName: nameSchema,
  customerNameExactMatch: matchTypeSchema,
  prefecture: z.union([
    z.literal("none"),
    z.enum(prefectures)
  ]).optional(),
  prefectureExactMatch: matchTypeSchema,
  address: z.string().trim().optional(),
  addressExactMatch: matchTypeSchema,
  additionalKeywords: z.array(additionalKeywordsSchema),
  additionalKeywordsSearchMode: searchModeSchema,
  searchSites: z.array(z.string()),
  siteSearchMode: z.enum(['any', 'specific', 'exclude']),
});

const searchPatternDescriptionSchema = z.string().trim().max(1000, { message: "1000文字以内で入力してください" }).optional();
export const searchPatternSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  searchPatternName: nameSchema,
  searchPatternDescription: searchPatternDescriptionSchema,
  searchParams: searchParamsSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  lastUsedAt: z.string().optional(),
});

