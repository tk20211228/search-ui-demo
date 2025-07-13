import "server-only";

import { Redis } from "@upstash/redis";

// Upstash Redisクライアントの初期化
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})