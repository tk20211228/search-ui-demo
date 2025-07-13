"use client";

import { SearchPatternFormModal } from "@/components/search/search-pattern-form-modal";
import { Card } from "@/components/ui/card";
import { useGoogleSearch } from "@/lib/swr/use-google-search";
import { searchPattern } from "@/lib/types/search";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { SearchForm } from "./search-form";
import { useSearch } from "../providers/search";
import { SearchPatternDeleteModal } from "./search-pattern-delete-modal";
import { RelatedPatterns } from "./related-patterns";

export function SearchPatternPage() {
  // DB対応していないため、クライアント側でsearchIdをURLから取得する
  const params = useParams();
  const searchId = params.searchId;
  const isNew = searchId === "create";
  const { searchPattern, setSearchPattern, searchPatterns, setSearchPatterns } =
    useSearch();
  const { data, isLoading, error } = useGoogleSearch(searchPattern, {
    enabled: !!searchPattern,
  });
  console.log("data", data);
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
  }, [searchPattern]);
  console.log("SearchPatternPage searchPattern", searchPattern);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSearch = (formData: searchPattern) => {
    console.log("SearchPatternPage handleSubmit", formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchPattern(formData);
  };
  const handleSaveAs = (formData: searchPattern) => {
    console.log("SearchPatternPage handleSaveAs", formData);
    setSearchPatterns([...searchPatterns, formData]);
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
                  {/* <SearchResults
                    data={data}
                    isLoading={isLoading}
                    closeSearch={() => setSearchPattern(null)}
                  /> */}
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
                    <ScrollArea className="h-full overflow-y-auto">
                      {/* 検索フォーム（サイドバー版） */}
                      <Card className="w-72 mx-4 p-4">
                        <SearchForm
                          handleSearch={handleSearch}
                          mode={mode}
                          isNew={isNew}
                          setShowSaveModal={setShowSaveModal}
                          setShowEditModal={setShowEditModal}
                          setShowDeleteModal={setShowDeleteModal}
                          handleSaveAs={handleSaveAs}
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
