import { SearchProvider } from "@/components/providers/search";
import { SearchPatternPage } from "@/components/search/search-pattern-page";
import { RouteParams } from "@/lib/types/utils";

export default async function SearchPatternDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  return <SearchPatternPage />;
}
