import { SearchProvider } from "@/components/providers/search";
import { Suspense } from "react";

export default async function CustomerSearchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchProvider>{children}</SearchProvider>
      </Suspense>
    </div>
  );
}
