"use client";

import { SearchPatternFormModal } from "@/components/search/search-pattern-form-modal";
import { Card } from "@/components/ui/card";
import { useGoogleSearch } from "@/lib/swr/use-google-search";
import { searchPattern } from "@/lib/types/search";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SearchForm } from "./search-form";
import { useSearch } from "../providers/search";
import { SearchPatternDeleteModal } from "./search-pattern-delete-modal";
import { RelatedPatterns } from "./related-patterns";
import { SearchResults } from "./search-results";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/constants/search";

export function SearchPatternPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // DB対応していないため、クライアント側でsearchIdをURLから取得する
  const params = useParams();
  const searchId = params.searchId;
  const isNew = searchId === "create";
  const { searchPattern, setSearchPattern } = useSearch();

  // URLパラメータからstart値を取得（デフォルト1）
  const currentStart = parseInt(searchParams.get("start") || "1", 10);

  const { data, isLoading, error } = useGoogleSearch(
    searchPattern,
    currentStart,
    {
      enabled: !!searchPattern,
    }
  );

  const [mode, setMode] = useState<"full" | "sidebar">("full");
  useEffect(() => {
    if (searchPattern) {
      setMode("sidebar");
    } else {
      if (isNew) {
        setMode("full");
      } else {
        setMode("sidebar");
      }
    }
  }, [searchPattern, isNew]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // URL更新
  const pathname = usePathname();
  const updateURL = useCallback(
    (newParams: URLSearchParams) => {
      const newURL = `${pathname}?${newParams.toString()}`;
      router.push(newURL);
    },
    [pathname, router]
  );

  // ページネーション用のハンドラー
  const handlePageChange = useCallback(
    (newStart: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("start", newStart.toString());
      updateURL(newParams);
    },
    [searchParams, updateURL]
  );

  const handleSearch = (formData: searchPattern) => {
    formData.lastUsedAt = new Date().toISOString();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("customerName", formData.searchParams.customerName);
    // 新しい検索時はstartを1にリセット
    newParams.set("start", "1");
    updateURL(newParams);
    setSearchPattern(formData);
  };

  const form = useFormContext<searchPattern>();
  const handleCloseSearch = () => {
    router.push("/customer-searches/create");
    setSearchPattern(null);
    form.reset(DEFAULT_SEARCH_PARAMS);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {mode === "full" ? (
            <motion.div
              key="search-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-2xl "
            >
              <SearchForm
                handleSearch={handleSearch}
                mode={mode}
                isNew={isNew}
                setShowDeleteModal={setShowDeleteModal}
              />
            </motion.div>
          ) : (
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-6">
                {/* 検索結果 */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <SearchResults
                    data={data}
                    isLoading={isLoading}
                    closeSearch={handleCloseSearch}
                    handlePageChange={handlePageChange}
                    currentStart={currentStart}
                    error={error}
                  />
                </motion.div>

                {/* サイドバー */}
                <motion.div
                  className="w-80"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* パターン管理 */}
                  <div className="sticky top-8 h-dvh w-80">
                    <ScrollArea className="h-full">
                      {/* 検索フォーム（サイドバー版） */}
                      <Card className="w-72 mx-4 p-4">
                        <SearchForm
                          handleSearch={handleSearch}
                          mode={mode}
                          isNew={isNew}
                          setShowSaveModal={setShowSaveModal}
                          setShowEditModal={setShowEditModal}
                          setShowDeleteModal={setShowDeleteModal}
                        />
                      </Card>

                      {/* パターン管理 */}
                      <RelatedPatterns />
                    </ScrollArea>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 保存モーダル */}
        <SearchPatternFormModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          currentName={searchPattern?.searchPatternName}
          currentDescription={searchPattern?.searchPatternDescription}
          mode="create"
        />
        {/* 編集モーダル */}
        <SearchPatternFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentName={searchPattern?.searchPatternName}
          currentDescription={searchPattern?.searchPatternDescription}
          mode="edit"
        />
        {/* 削除モーダル */}
        <SearchPatternDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
}
