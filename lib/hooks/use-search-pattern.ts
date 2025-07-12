'use client';

import { useCallback } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { SearchPattern, CustomerSearchParams } from '@/lib/types/search-pattern';
import { samplePatterns } from '@/lib/data/search';

// ID生成用のヘルパー関数
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export function useSearchPattern() {
  // use-local-storage-stateで自動的に永続化と日付変換を処理
  const [patterns, setPatterns] = useLocalStorageState<SearchPattern[]>(
    'searchPatterns',
    {
      defaultValue: samplePatterns,
      serializer: {
        stringify: (value) => JSON.stringify(value),
        parse: (value) => {
          const parsed = JSON.parse(value);
          // 日付をDateオブジェクトに変換
          return parsed.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            lastUsedAt: p.lastUsedAt ? new Date(p.lastUsedAt) : undefined,
          }));
        },
      },
    }
  );

  const [currentPatternId, setCurrentPatternId] = useLocalStorageState<string | undefined>(
    'currentPatternId',
    {
      defaultValue: () => {
        // 最後に使用したパターンまたは最初のパターンを選択
        const lastUsedPattern = patterns
          .filter(p => p.lastUsedAt)
          .sort((a, b) => (b.lastUsedAt?.getTime() || 0) - (a.lastUsedAt?.getTime() || 0))[0];
        return lastUsedPattern?.id || patterns[0]?.id;
      },
    }
  );

  // 現在選択中のパターンを取得
  const currentPattern = patterns.find((p) => p.id === currentPatternId);

  // パターンを作成
  const createPattern = useCallback(
    (name: string, description: string, params: CustomerSearchParams) => {
      const newPattern: SearchPattern = {
        id: generateId(),
        userId: 'demo-user',
        name,
        description,
        params,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setPatterns((prev) => [...prev, newPattern]);

      // 新しいパターンを選択
      setCurrentPatternId(newPattern.id);
      
      return newPattern;
    },
    []
  );

  // パターンを更新
  const updatePattern = useCallback(
    (id: string, updates: Partial<SearchPattern>) => {
      setPatterns((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              ...updates,
              updatedAt: new Date(),
            };
          }
          return p;
        })
      );
    },
    []
  );

  // パターンを削除
  const deletePattern = useCallback(
    (id: string) => {
      setPatterns((prev) => prev.filter((p) => p.id !== id));
      if (currentPatternId === id) {
        setCurrentPatternId(undefined);
      }
    },
    [currentPatternId]
  );

  // パターンを選択
  const selectPattern = useCallback(
    (id: string) => {
      setCurrentPatternId(id);
      // 最終使用日時を更新
      updatePattern(id, { lastUsedAt: new Date() });
    },
    [updatePattern]
  );

  // パターンを複製
  const duplicatePattern = useCallback(
    (id: string, newName: string) => {
      const original = patterns.find((p) => p.id === id);
      if (!original) return;

      const duplicate: SearchPattern = {
        ...original,
        id: generateId(),
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastUsedAt: undefined,
      };

      setPatterns((prev) => [...prev, duplicate]);
      return duplicate;
    },
    [patterns]
  );

  return {
    patterns,
    currentPattern,
    currentPatternId,
    createPattern,
    updatePattern,
    deletePattern,
    selectPattern,
    duplicatePattern,
  };
}