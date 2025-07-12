"use client";

import { useState, useEffect, useMemo } from "react";
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
  AsteriskIcon,
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
import { useForm, useFormContext } from "react-hook-form";
import z from "zod";
import { searchParamsSchema, searchPatternSchema } from "@/lib/schemas/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../../ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useSearch } from "@/lib/hooks/use-search";
import { SearchParams } from "@/lib/types/search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/constants/search";
import { SearchProvider } from "../../providers/search";

interface SearchFormProps {
  mode: "full" | "sidebar";
  isNew?: boolean;
  handleSearch: (params: SearchParams) => void;

  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: (name: string, description: string) => void;
}

export function SearchForm({
  mode,
  isNew = false,
  handleSearch,
  onEdit,
  onDelete,
  onSave,
}: SearchFormProps) {
  // // デフォルト値
  // const defaultSites = ["facebook.com", "linkedin.com", "nikkei.com123"];
  // const defaultKeywords = ["代表取締役", "社長", "専務123qwe"];

  const [showSaveModal, setShowSaveModal] = useState(false);

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
  // const form = useFormContext<SearchParams>();
  const form = useForm<SearchParams>({
    resolver: zodResolver(searchPatternSchema),
    // mode: "onChange",
    defaultValues: DEFAULT_SEARCH_PARAMS,
  });
  // const { isSubmitting, isValid, isValidating } = form.formState;
  // const searchPatternName = form.watch("searchPatternName");
  // const searchPatternDescription = form.watch("searchPatternDescription");
  // const defaultKeywords = DEFAULT_SEARCH_PARAMS.searchParams.additionalKeywords;
  // const defaultSites = DEFAULT_SEARCH_PARAMS.searchParams.searchSites;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSearch)} className={styles.form}>
        {/* 高度な検索オプション*/}
        <Accordion type="single" collapsible>
          <AccordionItem value="additional-info">
            <AccordionTrigger>追加情報</AccordionTrigger>
            <AccordionContent>
              {/* 追加キーワード */}
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="searchParams.age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>年齢</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="25"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        年齢を入力してください（18歳以上）。
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  );
}
