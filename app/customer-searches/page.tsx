import { SearchPatternHeader } from "@/components/search/search-pattern-header";
import { SearchPatternList } from "@/components/search/search-pattern-list";

export default function CustomerSearchesPage() {
  return (
    <div className="flex-1 space-y-8 mx-auto max-w-4xl px-1">
      <SearchPatternHeader />
      <SearchPatternList />
    </div>
  );
}
