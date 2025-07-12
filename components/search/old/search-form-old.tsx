"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  MoreHorizontal,
  Edit2,
  Trash2,
  Save,
  SaveAllIcon,
  SaveIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "@/components/ui/tag-input";
import { TagInputElegant } from "@/components/ui/tag-input-elegant";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomerSearchParams } from "@/lib/types/search-pattern";
import { prefectures } from "@/lib/data/search";
import { SearchPatternFormModal } from "@/components/search/search-pattern-form-modal";
import { Separator } from "@/components/ui/separator";

interface SearchFormProps {
  initialData?: CustomerSearchParams | null;
  onSubmit: (params: CustomerSearchParams) => void;
  isSearching?: boolean;
  mode?: "full" | "sidebar" | "compact";
  isNew?: boolean;
  showBackButton?: boolean;
  patternName?: string;
  patternDescription?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (name: string, description: string) => void;
}

export function SearchFormOld({
  initialData,
  onSubmit,
  isSearching = false,
  mode = "full",
  isNew = false,
  showBackButton = false,
  patternName,
  patternDescription,
  onEdit,
  onDelete,
  onSave,
}: SearchFormProps) {
  // デフォルト値
  const defaultSites = ["facebook.com", "linkedin.com", "nikkei.com"];
  const defaultKeywords = ["代表取締役", "社長", "専務"];

  const [formData, setFormData] = useState<CustomerSearchParams>(
    initialData || {
      customerName: "薮田大地",
      customerNameExactMatch: true,
      prefecture: "",
      city: "",
      addressExactMatch: true,
      additionalKeywords: [],
      keywordSearchMode: "and",
      searchSites: [...defaultSites],
      siteSearchMode: "any",
    }
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit", e);
    console.log("handleSubmit preventDefault", e.preventDefault());

    if (mode === "sidebar") {
      // サイドバーモードの場合、検索結果エリアをスクロール
      const searchResults = document.querySelector("[data-search-results]");
      if (searchResults) {
        searchResults.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // フルモードの場合、ページ全体をスクロール
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    console.log("formData", formData);

    onSubmit(formData);
  };

  const handleInputChange = (field: keyof CustomerSearchParams, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePattern = (name: string, description: string) => {
    onSave?.(name, description);
    setShowSaveModal(false);
  };

  // スタイル定義
  const styles = {
    form: cn(
      "w-full",
      mode === "sidebar" ? "space-y-4" : "max-w-2xl space-y-6"
    ),
    headerSection: cn(
      mode === "sidebar" ? "space-y-3 pb-3 border-b" : "space-y-4"
    ),
    headerContainer: cn(
      "flex items-start justify-between",
      mode === "sidebar" ? "gap-2" : "gap-4"
    ),
    headerTitle: cn(mode === "sidebar" ? "font-medium" : "text-2xl font-light"),
    headerDescription: cn(
      "text-muted-foreground",
      mode === "sidebar"
        ? "text-xs mt-1 truncate"
        : "mt-1 text-sm text-muted-foreground"
    ),
    basicInfoSection: cn(
      "space-y-4",
      mode === "sidebar"
        ? ""
        : "rounded-lg border bg-muted/50 p-6 dark:border-muted dark:bg-muted/50"
    ),
    sectionTitle: cn(
      "font-medium",
      mode === "sidebar" ? "text-sm" : "text-base"
    ),
    label: cn(mode === "sidebar" ? "text-sm" : ""),
    input: cn(mode === "sidebar" ? "h-9 text-sm" : "pr-10"),
    radioGroup: cn("flex", mode === "sidebar" ? "gap-4 text-xs" : "gap-6"),
    radioLabel: cn(
      "cursor-pointer",
      mode === "sidebar" ? "text-xs" : "text-sm"
    ),
    addressGrid: cn(
      "grid",
      mode === "sidebar" ? "grid-cols-2 gap-2" : "gap-3 md:grid-cols-2"
    ),
    selectTrigger: cn(mode === "sidebar" ? "h-9 text-sm" : ""),
    advancedSection: cn(
      "space-y-4",
      mode === "sidebar" ? "" : "rounded-lg bg-muted/50 p-4 dark:bg-muted"
    ),
    advancedButton: cn(
      "flex items-center text-sm font-medium",
      mode === "sidebar"
        ? "w-full justify-between"
        : "gap-2 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground"
    ),
    submitButton: cn("w-full"),
    submitButtonSize: (mode === "sidebar" ? "sm" : "lg") as "sm" | "lg",
  };

  // RadioGroupのID接頭辞（モードごとに異なるIDを使用）
  const idPrefix = mode === "sidebar" ? "sidebar" : "full";

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 戻るボタン（フル版のみ） */}
        {mode === "full" && showBackButton && (
          <div className="flex w-full bg-bg-100 h-12 mx-auto md:h-24 md:items-end">
            <Link
              href="/customer-searches"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              戻る
            </Link>
          </div>
        )}

        {/* ヘッダーとパターン情報セクション */}
        {(patternName || isNew || mode === "full") && (
          <div className={styles.headerSection}>
            <div className={styles.headerContainer}>
              <div className="flex-1 min-w-0">
                <h1 className={styles.headerTitle}>
                  {isNew ? "新規検索パターン" : patternName || "Loading..."}
                </h1>
                {(isNew || patternDescription || mode === "full") && (
                  <p className={styles.headerDescription}>
                    {isNew
                      ? mode === "sidebar"
                        ? "検索パターン名を決めて保存できます。"
                        : "検索条件を設定して、結果を確認後に保存できます"
                      : patternDescription || ""}
                  </p>
                )}
              </div>
              {isNew && onSave ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setShowSaveModal(true)}
                >
                  <SaveIcon className="size-5" />
                </Button>
              ) : (
                !isNew &&
                (onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon className="size-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={onEdit}>
                          <Edit2 className="mr-2 h-3 w-3" />
                          詳細を編集
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={onDelete}
                          variant="destructive"
                        >
                          <Trash2 className="mr-2 h-3 w-3" />
                          削除
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              )}
            </div>
          </div>
        )}

        {/* サイドバー版のみセクションタイトル表示 */}
        {mode === "sidebar" && (
          <h4 className={styles.sectionTitle}>検索条件</h4>
        )}

        {/* 基本情報 */}
        <div className={styles.basicInfoSection}>
          {mode === "full" && (
            <h3 className={styles.sectionTitle}>基本情報（AND検索）</h3>
          )}

          {/* 顧客氏名 */}
          <div className="space-y-2">
            <Label className={styles.label}>
              顧客氏名 <span className="text-destructive">*</span>
            </Label>
            <div className={mode === "full" ? "relative" : undefined}>
              <Input
                type="text"
                placeholder="例: 山田太郎"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                className={styles.input}
                required
              />
              {mode === "full" && (
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
            </div>
            <RadioGroup
              value={formData.customerNameExactMatch ? "exact" : "partial"}
              onValueChange={(value) =>
                handleInputChange("customerNameExactMatch", value === "exact")
              }
              className={styles.radioGroup}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exact" id={`${idPrefix}-name-exact`} />
                <Label
                  htmlFor={`${idPrefix}-name-exact`}
                  className={styles.radioLabel}
                >
                  完全一致
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem
                  value="partial"
                  id={`${idPrefix}-name-partial`}
                />
                <Label
                  htmlFor={`${idPrefix}-name-partial`}
                  className={styles.radioLabel}
                >
                  部分一致
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 住所 */}
          <div className="space-y-2">
            <Label className={styles.label}>
              住所{mode === "full" && "（任意）"}
            </Label>
            <div className={styles.addressGrid}>
              <Select
                value={formData.prefecture}
                onValueChange={(value) =>
                  handleInputChange("prefecture", value)
                }
              >
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue
                    placeholder={
                      mode === "sidebar" ? "都道府県" : "都道府県を選択"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">選択しない</SelectItem>
                  {prefectures.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder={
                  mode === "sidebar" ? "市区町村" : "市区町村（例: 港区）"
                }
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={mode === "sidebar" ? "h-9 text-sm" : ""}
              />
            </div>
            {mode === "full" && (
              <RadioGroup
                value={formData.addressExactMatch ? "exact" : "partial"}
                onValueChange={(value) =>
                  handleInputChange("addressExactMatch", value === "exact")
                }
                className={styles.radioGroup}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="exact" id="address-exact" />
                  <Label htmlFor="address-exact" className={styles.radioLabel}>
                    完全一致
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="partial" id="address-partial" />
                  <Label
                    htmlFor="address-partial"
                    className={styles.radioLabel}
                  >
                    部分一致
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>
        </div>

        {/* 高度なオプション */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedButton}
          >
            {mode === "full" &&
              (showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              ))}
            {mode === "full" ? "高度な検索オプション" : "詳細オプション"}
            {mode === "sidebar" &&
              (showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              ))}
          </button>

          {showAdvanced && (
            <div className={styles.advancedSection}>
              {/* 追加キーワード */}
              <div className="space-y-2">
                <Label className={styles.label}>
                  追加キーワード{mode === "full" && "（任意）"}
                </Label>
                <TagInputElegant
                  value={formData.additionalKeywords}
                  onChange={(tags) =>
                    handleInputChange("additionalKeywords", tags)
                  }
                  placeholder={
                    mode === "sidebar" ? "役職など" : "会社名、役職など"
                  }
                  defaultTags={defaultKeywords}
                />
                <RadioGroup
                  value={formData.keywordSearchMode}
                  onValueChange={(value: "and" | "or") =>
                    handleInputChange("keywordSearchMode", value)
                  }
                  className={cn("mt-2", mode === "sidebar" && "flex gap-3")}
                >
                  {mode === "full" && (
                    <Label className="mb-2 block text-sm">
                      キーワード検索モード
                    </Label>
                  )}
                  <div
                    className={mode === "sidebar" ? "flex gap-3" : "flex gap-6"}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="and"
                        id={`${idPrefix}-keyword-and`}
                      />
                      <Label
                        htmlFor={`${idPrefix}-keyword-and`}
                        className={styles.radioLabel}
                      >
                        {mode === "sidebar" ? "AND" : "すべてを含む（AND）"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="or"
                        id={`${idPrefix}-keyword-or`}
                      />
                      <Label
                        htmlFor={`${idPrefix}-keyword-or`}
                        className={styles.radioLabel}
                      >
                        {mode === "sidebar" ? "OR" : "いずれかを含む（OR）"}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {mode === "sidebar" && <Separator className="my-4" />}

              {/* 検索対象サイト */}
              <div className="space-y-2">
                <Label className={styles.label}>検索対象サイト</Label>
                <TagInput
                  value={formData.searchSites}
                  onChange={(tags) => handleInputChange("searchSites", tags)}
                  placeholder={
                    mode === "sidebar"
                      ? "ドメイン"
                      : "追加するドメインを入力（例: example.com）"
                  }
                  defaultTags={defaultSites}
                />
                <RadioGroup
                  value={formData.siteSearchMode}
                  onValueChange={(value: "any" | "specific" | "exclude") =>
                    handleInputChange("siteSearchMode", value)
                  }
                  className={cn("mt-4", mode === "sidebar" && "mt-2")}
                >
                  {mode === "full" && (
                    <Label className="mb-2 block text-sm">
                      サイト検索モード
                    </Label>
                  )}
                  <div
                    className={mode === "sidebar" ? "flex gap-2" : "space-y-2"}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id={`${idPrefix}-site-any`} />
                      <Label
                        htmlFor={`${idPrefix}-site-any`}
                        className={styles.radioLabel}
                      >
                        {mode === "sidebar" ? "すべて" : "すべてのサイト"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="specific"
                        id={`${idPrefix}-site-specific`}
                      />
                      <Label
                        htmlFor={`${idPrefix}-site-specific`}
                        className={styles.radioLabel}
                      >
                        {mode === "sidebar"
                          ? "指定のみ"
                          : "指定サイトのみ（OR検索）"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="exclude"
                        id={`${idPrefix}-site-exclude`}
                      />
                      <Label
                        htmlFor={`${idPrefix}-site-exclude`}
                        className={styles.radioLabel}
                      >
                        {mode === "sidebar" ? "除外" : "指定サイトを除外"}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          size={styles.submitButtonSize}
          className={styles.submitButton}
          disabled={isSearching || !formData.customerName.trim()}
        >
          {isSearching ? (
            <>
              <div
                className={cn(
                  "mr-2 animate-spin rounded-full border-2 border-white border-t-transparent",
                  mode === "sidebar" ? "h-3 w-3" : "h-4 w-4"
                )}
              />
              検索中...
            </>
          ) : mode === "sidebar" ? (
            "再検索"
          ) : (
            "検索"
          )}
        </Button>
      </form>

      {/* 保存モーダル */}
      {isNew && onSave && (
        <SearchPatternFormModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          // onSave={handleSavePattern}
          mode="create"
        />
      )}
    </>
  );
}
