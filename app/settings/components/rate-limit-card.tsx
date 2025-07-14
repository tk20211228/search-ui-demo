"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getRateLimitStatus } from "@/lib/actions/rate-limit";
import type { RateLimitStatus } from "@/lib/types/rate-limit";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function RateLimitCard() {
  const [status, setStatus] = useState<RateLimitStatus | null>(null);
  const [loading, setLoading] = useState(true);
  // const [, setResetting] = useState(false);

  // レート制限状態を取得
  const fetchStatus = async () => {
    try {
      const data = await getRateLimitStatus();
      setStatus(data);

      // 警告通知（残り200回以下）
      if (data.remaining <= 200 && data.remaining > 0) {
        toast.warning(`API使用制限の警告: 残り${data.remaining}回`, {
          description: "使用制限に近づいています。",
        });
      }

      // エラー通知（制限到達）
      if (data.remaining === 0) {
        toast.error("API使用制限に到達しました", {
          description: `次回リセット: ${new Date(data.resetAt).toLocaleString(
            "ja-JP",
            { timeZone: "Asia/Tokyo" }
          )}`,
        });
      }
    } catch (error) {
      console.error("Failed to fetch rate limit status:", error);
      toast.error("レート制限の状態を取得できませんでした");
    } finally {
      setLoading(false);
    }
  };

  // リセット処理
  // const handleReset = async () => {
  //   setResetting(true);
  //   try {
  //     const result = await resetRateLimit();
  //     if (result.success) {
  //       toast.success(result.message);
  //       await fetchStatus();
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch (error) {
  //     toast.error("リセットに失敗しました");
  //   } finally {
  //     setResetting(false);
  //   }
  // };

  // 初回読み込みと5秒ごとの自動更新
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !status) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>API使用状況</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = (status.used / status.limit) * 100;
  const isWarning = status.remaining <= 200 && status.remaining > 0;
  const isError = status.remaining === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">API使用状況</CardTitle>
            <CardDescription>Google Custom Search API</CardDescription>
          </div>
          {isWarning && <AlertTriangle className="h-5 w-5 text-orange-500" />}
          {isError && <AlertTriangle className="h-5 w-5 text-red-500" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 使用状況の大きな数字表示 */}
        <div className="text-center">
          <p className="text-5xl font-bold tracking-tight">
            {status.used.toLocaleString()}
            <span className="text-2xl text-muted-foreground font-normal">
              {" / "}
              {status.limit.toLocaleString()}
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            残り {status.remaining.toLocaleString()} 回
          </p>
        </div>

        {/* プログレスバー */}
        <div className="space-y-2">
          <Progress
            value={usagePercentage}
            className={`h-3 ${
              isError
                ? "bg-red-100 dark:bg-red-950"
                : isWarning
                ? "bg-orange-100 dark:bg-orange-950"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(usagePercentage)}% 使用済み</span>
            <span>1日 2,000回まで</span>
          </div>
        </div>

        {/* リセット時刻 */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            次回リセット:{" "}
            {new Date(status.resetAt).toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {getTimeUntilReset(status.resetAt)}
          </p>
        </div>

        {/* 開発環境でのリセットボタン */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleReset}
              disabled={resetting}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${resetting ? 'animate-spin' : ''}`} />
              {resetting ? 'リセット中...' : '使用回数をリセット（開発環境のみ）'}
            </Button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}

// リセットまでの時間を相対的に表示
function getTimeUntilReset(resetAt: string): string {
  const now = new Date();
  const reset = new Date(resetAt);
  const diffMs = reset.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "まもなくリセット";
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `約${hours}時間${minutes}分後`;
  }
  return `約${minutes}分後`;
}
