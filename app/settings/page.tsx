import { RateLimitCard } from './components/rate-limit-card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <Link 
          href="/customer-searches" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          検索画面に戻る
        </Link>
        
        <h1 className="text-3xl font-bold tracking-tight">設定</h1>
        <p className="text-muted-foreground mt-2">
          システムの設定とAPI使用状況を確認できます
        </p>
      </div>

      {/* API使用状況 */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">API使用状況</h2>
          <RateLimitCard />
        </div>
      </section>
    </div>
  )
}