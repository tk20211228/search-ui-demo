import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import type { RateLimitStatus, RateLimitCheckResult } from '@/lib/types/rate-limit'
import { RateLimitError } from '@/lib/types/rate-limit'
import { redis } from './upstash/client';



// レート制限の設定: 1日2000回
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(2000, '1d'),
  analytics: true,
  prefix: 'google-search',
})

// 日本時間での日次リセット時刻を取得
function getJapanResetTime(): Date {
  const now = new Date()
  const japanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
  
  // 次の0時0分0秒（日本時間）を計算
  const resetTime = new Date(japanTime)
  resetTime.setHours(24, 0, 0, 0)
  
  return resetTime
}

// レート制限状態を取得
async function getRateLimitStatus(identifier: string): Promise<RateLimitStatus> {
  try {
    // getRemaining APIを使用して現在の状態を取得
    const { remaining, reset } = await ratelimit.getRemaining(identifier)
    
    const used = 2000 - (remaining || 0)
    
    return {
      limit: 2000,
      used,
      remaining: remaining || 0,
      resetAt: new Date(reset || Date.now()).toISOString(),
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    // エラー時はデフォルト値を返す
    return {
      limit: 2000,
      used: 0,
      remaining: 2000,
      resetAt: getJapanResetTime().toISOString(),
    }
  }
}

// レート制限をチェック
export async function checkRateLimit(identifier: string = 'global'): Promise<RateLimitCheckResult> {
  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier)
    
    const status: RateLimitStatus = {
      limit: limit || 2000,
      used: (limit || 2000) - (remaining || 0),
      remaining: remaining || 0,
      resetAt: new Date(reset || Date.now()).toISOString(),
    }
    
    if (!success) {
      const retryAfter = Math.max(0, Math.floor((reset - Date.now()) / 1000))
      return {
        allowed: false,
        status,
        retryAfter,
      }
    }
    
    return {
      allowed: true,
      status,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // エラー時は通過させる（サービスの継続性を優先）
    return {
      allowed: true,
      status: await getRateLimitStatus(identifier),
    }
  }
}

// レート制限状態を取得（使用回数を増やさない）
export async function getRateLimitStatusOnly(identifier: string = 'global'): Promise<RateLimitStatus> {
  try {
    // getRemaining APIを使用して現在の状態を取得
    const { remaining, reset } = await ratelimit.getRemaining(identifier)
    
    const used = 2000 - (remaining || 0)
    
    return {
      limit: 2000,
      used,
      remaining: remaining || 0,
      resetAt: new Date(reset || Date.now()).toISOString(),
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return {
      limit: 2000,
      used: 0,
      remaining: 2000,
      resetAt: getJapanResetTime().toISOString(),
    }
  }
}

// 開発環境用: レート制限をリセット
export async function resetRateLimit(identifier: string = 'global'): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Rate limit reset is only available in development environment')
  }
  
  try {
    const key = `google-search:${identifier}`
    await redis.del(key)
  } catch (error) {
    console.error('Failed to reset rate limit:', error)
    throw error
  }
}

// レート制限エラーを作成
export function createRateLimitError(status: RateLimitStatus, retryAfter?: number): RateLimitError {
  const message = `API rate limit exceeded. ${status.remaining} of ${status.limit} requests remaining. Resets at ${new Date(status.resetAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
  return new RateLimitError(message, status, retryAfter)
}