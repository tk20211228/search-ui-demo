import { SearchProvider } from "@/components/providers/search";
import { RouteParams } from "@/lib/types/utils";

export default async function CustomerSearchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-white dark:bg-neutral-950">
      <SearchProvider>{children}</SearchProvider>
    </div>
  );
}
