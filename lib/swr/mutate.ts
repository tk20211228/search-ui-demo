import { mutate } from "swr";

/**
 * 指定されたプレフィックスで始まるすべてのSWRキャッシュを無効化
 */
export const mutatePrefix = (prefix: string | string[]) =>
  mutate(
    (key) =>
      typeof key === "string" &&
      (Array.isArray(prefix)
        ? prefix.some((p) => key.startsWith(p))
        : key.startsWith(prefix)),
    undefined,
    { revalidate: true },
  );

/**
 * 指定されたサフィックスで終わるすべてのSWRキャッシュを無効化
 */
export const mutateSuffix = (suffix: string | string[]) =>
  mutate(
    (key) =>
      typeof key === "string" &&
      (Array.isArray(suffix)
        ? suffix.some((s) => key.endsWith(s))
        : key.endsWith(suffix)),
    undefined,
    {
      revalidate: true,
    },
  );

/**
 * 検索関連のキャッシュをすべてクリア
 */
export const clearSearchCache = () => {
  mutatePrefix("google-search");
};

/**
 * 特定のパターンに一致するキャッシュを無効化
 */
export const mutatePattern = (pattern: RegExp) =>
  mutate(
    (key) => {
      if (typeof key === "string") {
        return pattern.test(key);
      }
      if (Array.isArray(key) && key.length > 0 && typeof key[0] === "string") {
        return pattern.test(key[0]);
      }
      return false;
    },
    undefined,
    { revalidate: true }
  );