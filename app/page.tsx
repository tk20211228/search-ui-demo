import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-light tracking-tight text-foreground">
            Customer Search System
          </h1>
          <p className="text-lg text-muted-foreground">
            効率的な顧客情報検索システム
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/customer-searches">
            <Button size="lg" className="min-w-[200px]">
              検索を開始
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
