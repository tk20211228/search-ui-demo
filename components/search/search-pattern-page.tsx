"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchFormOld } from "@/components/search/old/search-form-old";
import { SearchResults } from "@/components/search/search-results";
import { RelatedPatterns } from "@/components/search/related-patterns";
import { SearchPatternFormModal } from "@/components/search/search-pattern-form-modal";
import { useSearch } from "@/lib/hooks/use-search";
import { useSearchPattern } from "@/lib/hooks/use-search-pattern";
import {
  CustomerSearchParams,
  SearchPattern,
} from "@/lib/types/search-pattern";
import { buildSearchQuery } from "@/lib/search-utils";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "@/components/ui/card";
import { SearchForm } from "./search-form";
import { SearchParams } from "@/lib/types/search";
import { useGoogleSearch } from "@/lib/swr/use-google-search";
import { SearchProvider } from "../providers/search";

interface SearchPatternPageProps {
  searchId?: string;
}

export function SearchPatternPage({ searchId }: SearchPatternPageProps) {
  const router = useRouter();
  const { search, performSearch, closeSearch } = useSearch();
  const {
    patterns,
    selectPattern,
    updatePattern,
    deletePattern,
    createPattern,
  } = useSearchPattern();

  const isNew = searchId === "create";
  const [currentPattern, setCurrentPattern] = useState<SearchPattern | null>(
    null
  );
  const [currentFormData, setCurrentFormData] =
    useState<CustomerSearchParams | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const { data, isLoading, error } = useGoogleSearch(searchParams, {
    enabled: !!searchParams,
  });
  console.log("data", data);
  const [mode, setMode] = useState<"full" | "sidebar">("full");
  useEffect(() => {
    if (searchParams) {
      setMode("sidebar");
    } else {
      setMode("full");
    }
  }, [searchParams]);
  const [showModal, setShowModal] = useState(false);
  console.log("showModal", showModal);

  // // 検索実行
  // const handleSearchOld = (formData: CustomerSearchParams) => {
  //   setCurrentFormData(formData);

  //   // 既存パターンの場合、パラメータが変更されていれば更新
  //   if (
  //     currentPattern &&
  //     JSON.stringify(formData) !== JSON.stringify(currentPattern.params)
  //   ) {
  //     updatePattern(currentPattern.id, { params: formData });
  //   }

  //   const searchParams = buildSearchQuery(formData);
  // };
  const handleSearch = (formData: SearchParams) => {
    console.log("handleSubmit", formData);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSearchParams(formData);
  };

  // パターン保存（新規作成時）
  // const handleSavePattern = (name: string, description: string) => {
  //   if (currentFormData) {
  //     const newPattern = createPattern(name, description, currentFormData);
  //     router.push(`/customer-searches/${newPattern.id}`);
  //   }
  // };

  // パターン編集（既存パターン）
  // const handleEditSave = (name: string, description: string) => {
  //   if (currentPattern) {
  //     updatePattern(currentPattern.id, { name, description });
  //     setCurrentPattern({
  //       ...currentPattern,
  //       name,
  //       description,
  //     });
  //   }
  // };

  // パターン削除
  const handleDelete = () => {
    if (currentPattern && confirm("このパターンを削除してもよろしいですか？")) {
      deletePattern(currentPattern.id);
      router.push("/customer-searches");
    }
  };

  const otherPatterns = currentPattern
    ? patterns.filter((p) => p.id !== currentPattern.id)
    : patterns;

  return (
    // <SearchProvider>
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <AnimatePresence mode="wait">
          {!searchParams ? (
            <motion.div
              key="search-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-2xl "
              // className="flex gap-4"
            >
              {/* <SearchFormOld
                initialData={currentPattern?.params}
                onSubmit={handleSearchOld}
                // isSearching={search.isSearching}
                isNew={isNew}
                showBackButton={true}
                patternName={!isNew ? currentPattern?.name : undefined}
                patternDescription={
                  !isNew ? currentPattern?.description : undefined
                }
                onEdit={!isNew ? () => setShowEditModal(true) : undefined}
                onDelete={!isNew ? handleDelete : undefined}
              /> */}
              <SearchForm
                handleSearch={handleSearch}
                mode={mode}
                isNew={isNew}
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
                    closeSearch={() => setSearchParams(null)}
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
                        {/* <SearchFormOld
                          mode="sidebar"
                          initialData={
                            currentPattern?.params || currentFormData
                          }
                          onSubmit={handleSearch}
                          isSearching={search.isSearching}
                          isNew={isNew}
                          patternName={
                            !isNew ? currentPattern?.name : undefined
                          }
                          patternDescription={
                            !isNew ? currentPattern?.description : undefined
                          }
                          onEdit={
                            !isNew ? () => setShowEditModal(true) : undefined
                          }
                          onDelete={!isNew ? handleDelete : undefined}
                          onSave={isNew ? handleSavePattern : undefined}
                        /> */}
                        <SearchForm
                          handleSearch={handleSearch}
                          mode={mode}
                          isNew={isNew}
                          setShowModal={setShowModal}
                        />
                      </Card>

                      {/* パターン管理 */}
                      {/* <RelatedPatterns patterns={otherPatterns} /> */}
                    </ScrollArea>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 編集モーダル */}
        <SearchPatternFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          // onSave={handleEditSave}
          currentName={currentPattern?.name}
          currentDescription={currentPattern?.description}
          mode={isNew ? "create" : "edit"}
        />
      </div>
    </div>
    // </SearchProvider>
  );
}
