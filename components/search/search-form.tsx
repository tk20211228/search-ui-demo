"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";
import { TagInputElegant } from "@/components/ui/tag-input-elegant";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/constants/search";
import { prefectures } from "@/lib/data/search";
import { searchPattern } from "@/lib/types/search";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Edit2,
  MoreHorizontalIcon,
  SaveIcon,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";

interface SearchFormProps {
  mode: "full" | "sidebar";
  isNew: boolean;
  handleSearch: (params: searchPattern) => void;

  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (name: string, description: string) => void;
  setShowSaveModal?: (show: boolean) => void;
  setShowEditModal?: (show: boolean) => void;
  setShowDeleteModal?: (show: boolean) => void;
}

export function SearchForm({
  mode,
  isNew,
  handleSearch,
  setShowSaveModal,
  setShowEditModal,
  setShowDeleteModal,
}: SearchFormProps) {
  // console.log("mode", mode);
  const form = useFormContext<searchPattern>();
  const prefecture = form.watch("searchParams.prefecture");
  // console.log("prefecture", prefecture);
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
    headerTitle: cn(
      mode === "sidebar" ? "font-medium truncate" : "text-2xl font-light"
    ),
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
      "cursor-pointer text-muted-foreground",
      mode === "sidebar" ? "text-xs" : "text-sm",
      "peer-data-[state=checked]:text-foreground"
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

  const { isSubmitting, isValidating } = form.formState;
  const searchPatternName = form.watch("searchPatternName");
  const searchPatternDescription = form.watch("searchPatternDescription");
  const defaultAdditionalKeywords =
    DEFAULT_SEARCH_PARAMS.searchParams.additionalKeywords;
  const defaultExcludeKeywords =
    DEFAULT_SEARCH_PARAMS.searchParams.excludeKeywords;
  const defaultSites = DEFAULT_SEARCH_PARAMS.searchParams.searchSites;
  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleSearch, (errors) => {
          console.log("errors", errors);
        })}
        className={styles.form}
      >
        {/* 戻るボタン（フル版のみ） */}
        {mode === "full" && (
          <div className="flex w-full bg-bg-100 h-12 mx-auto md:h-24 md:items-end">
            <Button
              variant="ghost"
              size="sm"
              asChild
              onClick={() => form.reset()}
            >
              <Link
                href="/customer-searches"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 size-4" />
                戻る
              </Link>
            </Button>
          </div>
        )}

        {/* ヘッダーとパターン情報セクション */}
        <div className={styles.headerSection}>
          <div className={styles.headerContainer}>
            <div className="flex-1 min-w-0">
              <h1 className={styles.headerTitle}>{searchPatternName}</h1>
              <p className={styles.headerDescription}>
                {isNew
                  ? mode === "sidebar"
                    ? "検索パターン名を決めて保存できます。"
                    : "検索条件を設定して、結果を確認後に保存できます"
                  : searchPatternDescription || ""}
              </p>
            </div>
            {isNew && mode === "sidebar" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setShowSaveModal?.(true)}
              >
                <SaveIcon className="size-5" />
              </Button>
            ) : (
              !isNew && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditModal?.(true)}>
                      <Edit2 className="mr-2 size-4" />
                      設定を更新
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSaveModal?.(true)}>
                      <SaveIcon className="mr-2 size-4" />
                      名前をつけて保存
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteModal?.(true)}
                      variant="destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            )}
          </div>
        </div>

        {/* 基本情報 */}
        <div className={styles.basicInfoSection}>
          {mode === "full" && (
            <h3 className={styles.sectionTitle}>基本情報（AND検索）</h3>
          )}

          {/* 顧客氏名 */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="searchParams.customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="relative">
                    顧客氏名
                    <span className="text-destructive">*</span>
                    {mode === "full" && (
                      <FormMessage className="absolute top-1/2 right-1 -translate-y-1/2" />
                    )}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="例: 山田太郎"
                        className={styles.input}
                        {...field}
                        value={field.value || ""}
                      />
                      {mode === "full" && (
                        <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="searchParams.customerNameExactMatch"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className={styles.radioGroup}
                    >
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="exact" className="peer" />
                        </FormControl>
                        <FormLabel className={styles.radioLabel}>
                          完全一致
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <RadioGroupItem value="partial" className="peer" />
                        </FormControl>
                        <FormLabel className={styles.radioLabel}>
                          部分一致
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* 住所 */}
          <div className="space-y-2">
            <Label className="relative">
              住所{mode === "full" && "（任意）"}
              {mode === "full" && (
                <FormMessage className="absolute top-1/2 right-1 -translate-y-1/2" />
              )}
            </Label>
            <div className={styles.addressGrid}>
              {/* 都道府県 */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="searchParams.prefecture"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={styles.selectTrigger}>
                            <SelectValue
                              placeholder={
                                mode === "sidebar"
                                  ? "都道府県"
                                  : "都道府県を選択"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {prefectures.map((pref, index) => (
                              <SelectItem key={index} value={pref}>
                                {pref}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchParams.prefectureExactMatch"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className={styles.radioGroup}
                        >
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem value="exact" className="peer" />
                            </FormControl>
                            <FormLabel className={styles.radioLabel}>
                              {mode === "full" ? "完全一致" : "完全"}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem
                                value="partial"
                                className="peer"
                              />
                            </FormControl>
                            <FormLabel className={styles.radioLabel}>
                              {mode === "full" ? "部分一致" : "部分"}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* 市区町村以降 */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="searchParams.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={
                            mode === "sidebar"
                              ? "市区町村以降"
                              : "例: 東京都港区赤坂1-1-1"
                          }
                          className={styles.input}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchParams.addressExactMatch"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className={styles.radioGroup}
                        >
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem value="exact" className="peer" />
                            </FormControl>
                            <FormLabel className={styles.radioLabel}>
                              {mode === "full" ? "完全一致" : "完全"}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem
                                value="partial"
                                className="peer"
                              />
                            </FormControl>
                            <FormLabel className={styles.radioLabel}>
                              {mode === "full" ? "部分一致" : "部分"}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 高度な検索オプション*/}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-2">
            <AccordionTrigger
              className={`bg-muted/50 px-6
              dark:hover:bg-muted transition-colors 
              [&[data-state=open]]:rounded-b-none
              dark:[&[data-state=open]]:bg-muted
              `}
            >
              {mode === "full" ? "高度な検索オプション" : "詳細オプション"}
            </AccordionTrigger>
            <AccordionContent
              className={`
              bg-muted/50 pb-4 rounded-b-lg px-6 pt-2
              dark:[&[data-state=open]]:bg-muted
              `}
            >
              {/* 追加キーワード */}
              <div className="space-y-3">
                <Label className={styles.label}>
                  追加キーワード{mode === "full" && "（任意）"}
                </Label>

                <FormField
                  control={form.control}
                  name="searchParams.additionalKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInputElegant
                          keywords={field.value || []}
                          onChange={field.onChange}
                          placeholder={
                            mode === "sidebar" ? "役職など" : "会社名、役職など"
                          }
                          defaultKeywords={defaultAdditionalKeywords}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="searchParams.additionalKeywordsSearchMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className={cn(
                            "mt-2",
                            mode === "sidebar" && "flex gap-3"
                          )}
                        >
                          <div
                            className={
                              mode === "sidebar" ? "flex gap-3" : "flex gap-6"
                            }
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="and" className="peer" />
                              </FormControl>
                              <FormLabel className={styles.radioLabel}>
                                {mode === "sidebar"
                                  ? "AND"
                                  : "すべてを含む（AND）"}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="or" className="peer" />
                              </FormControl>
                              <FormLabel className={styles.radioLabel}>
                                {mode === "sidebar"
                                  ? "OR"
                                  : "いずれかを含む（OR）"}
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />

                <Label className={styles.label}>
                  除外キーワード{mode === "full" && "（任意）"}
                </Label>

                <FormField
                  control={form.control}
                  name="searchParams.excludeKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInputElegant
                          keywords={field.value || []}
                          onChange={field.onChange}
                          placeholder={
                            mode === "sidebar" ? "東京都" : "東京都、大阪府など"
                          }
                          defaultKeywords={defaultExcludeKeywords}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator className="my-4" />
                {/* 検索対象サイト */}
                <Label className={styles.label}>検索対象サイト</Label>

                <FormField
                  control={form.control}
                  name="searchParams.searchSites"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder={
                            mode === "sidebar"
                              ? "ドメイン"
                              : "追加するドメインを入力（例: example.com）"
                          }
                          defaultTags={defaultSites}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="searchParams.siteSearchMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className={cn("mt-4", mode === "sidebar" && "mt-2")}
                        >
                          <div className="flex gap-6">
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="any" className="peer" />
                              </FormControl>
                              <FormLabel className={styles.radioLabel}>
                                {mode === "sidebar" ? "全て" : "すべてのサイト"}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem
                                  value="specific"
                                  className="peer"
                                />
                              </FormControl>
                              <FormLabel className={styles.radioLabel}>
                                {mode === "sidebar" ? "指定" : "指定サイトのみ"}
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem
                                  value="exclude"
                                  className="peer"
                                />
                              </FormControl>
                              <FormLabel className={styles.radioLabel}>
                                {mode === "sidebar"
                                  ? "除外"
                                  : "指定サイトを除外"}
                              </FormLabel>
                            </FormItem>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          type="submit"
          size={styles.submitButtonSize}
          className={styles.submitButton}
          disabled={isValidating}
        >
          {isSubmitting ? (
            <>
              <div
                className={cn(
                  "mr-2 animate-spin rounded-full border-2 border-white border-t-transparent",
                  mode === "sidebar" ? "size-3" : "size-4"
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
    </>
  );
}
