// レート制限の状態
export interface RateLimitStatus {
  limit: number
  used: number
  remaining: number
  resetAt: string // ISO 8601形式の日時文字列
}

// レート制限チェックの結果
export interface RateLimitCheckResult {
  allowed: boolean
  status: RateLimitStatus
  retryAfter?: number // 制限超過時の再試行までの秒数
}

// レート制限エラー
export class RateLimitError extends Error {
  constructor(
    message: string,
    public status: RateLimitStatus,
    public retryAfter?: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// 検索レスポンスの拡張型
export interface SearchResponseWithRateLimit<T = unknown> {
  data?: T
  error?: string
  rateLimitStatus?: RateLimitStatus
}