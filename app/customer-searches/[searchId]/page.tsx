import { SearchProvider } from "@/components/providers/search";
import { SearchPatternPage } from "@/components/search/search-pattern-page";

export default async function SearchPatternDetailPage({
  params,
}: {
  params: Promise<{ searchId: string }>;
}) {
  const { searchId } = await params;

  return (
    <SearchProvider>
      <SearchPatternPage searchId={searchId} />
    </SearchProvider>
  );
}
