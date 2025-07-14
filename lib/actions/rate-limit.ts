"use server";

import { getRateLimitStatusOnly, resetRateLimit as resetRateLimitUtil } from '@/lib/rate-limit';
import type { RateLimitStatus } from '@/lib/types/rate-limit';

// レート制限の状態を取得
export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  try {
    return await getRateLimitStatusOnly('global');
  } catch (error) {
    console.error('Failed to get rate limit status:', error);
    throw new Error('レート制限の状態を取得できませんでした');
  }
}

// 開発環境のみ: レート制限をリセット
export async function resetRateLimit(): Promise<{ success: boolean; message: string }> {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return {
        success: false,
        message: 'レート制限のリセットは開発環境でのみ利用可能です',
      };
    }

    await resetRateLimitUtil('global');
    
    return {
      success: true,
      message: 'レート制限がリセットされました',
    };
  } catch (error) {
    console.error('Failed to reset rate limit:', error);
    return {
      success: false,
      message: 'レート制限のリセットに失敗しました',
    };
  }
}