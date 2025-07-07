'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSearch } from '@/hooks/use-search';
import { useWindowSize, useIsMobile } from '@/hooks/use-window-size';
import { SearchForm } from './search-form';
import { SearchResults } from './search-results';

export function SearchContainer() {
  const { search } = useSearch();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = useIsMobile();

  const sidebarWidth = isMobile ? windowWidth : 320;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <AnimatePresence mode="wait">
        {!search.isVisible ? (
          <motion.div
            key="search-form-center"
            className="flex items-center justify-center min-h-screen p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SearchForm />
          </motion.div>
        ) : (
          <motion.div
            key="search-layout"
            className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="px-8 py-8 lg:px-16">
              <div className="max-w-7xl mx-auto flex gap-6">
                {/* 検索結果エリア（左側） */}
                <motion.div
                  className={`${
                    isMobile ? 'w-full' : 'flex-1'
                  } min-h-[calc(100vh-4rem)]`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.1,
                      type: 'spring',
                      stiffness: 400,
                      damping: 40,
                      mass: 0.8,
                    },
                  }}
                >
                  <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-sm p-8">
                    <SearchResults />
                  </div>
                </motion.div>

                {/* 検索フォームエリア（右側） */}
                {!isMobile && (
                  <motion.div
                    className="w-80"
                    initial={{
                      opacity: 0,
                      x: search.boundingBox.left - (windowWidth - sidebarWidth - 128), // paddingを考慮
                      y: search.boundingBox.top - 32, // top paddingを考慮
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 40,
                        mass: 0.8,
                      },
                    }}
                  >
                    <div className="sticky top-8">
                      <motion.div
                        className="bg-white dark:bg-neutral-950 rounded-lg shadow-sm p-6"
                        initial={{
                          width: search.boundingBox.width,
                          height: search.boundingBox.height,
                        }}
                        animate={{
                          width: sidebarWidth,
                          height: 'auto',
                          transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 40,
                            mass: 0.8,
                          },
                        }}
                      >
                        <SearchForm isCompact />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* モバイル用フローティングボタン */}
            {isMobile && (
              <motion.button
                className="fixed bottom-6 right-6 w-14 h-14 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-full shadow-lg flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // モバイルでの検索フォーム表示（実装は省略）
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}