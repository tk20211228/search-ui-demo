"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SearchParams } from "@/lib/types/search";
import { useFormContext } from "react-hook-form";
import useLocalStorageState from "use-local-storage-state";

interface SearchPatternFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: (name: string, description: string) => void;
  currentName?: string;
  currentDescription?: string;
  mode: "create" | "edit";
}

export function SearchPatternFormModal({
  isOpen,
  onClose,
  mode,
}: SearchPatternFormModalProps) {
  const form = useFormContext<SearchParams>();
  const [searchPattern, setSearchPattern] = useLocalStorageState<
    SearchParams[] | []
  >("searchPatterns-new", {
    defaultValue: [],
  });

  const handleCreateOrEdit = (formData: SearchParams) => {
    console.log("handleSave", searchPattern);
    if (mode === "create") {
      formData.id = crypto.randomUUID();
      formData.userId = "demo-user";
      formData.createdAt = new Date().toISOString();
      setSearchPattern([...searchPattern, formData]);
    } else {
      setSearchPattern(
        searchPattern.map((pattern) =>
          pattern.id === formData.id ? formData : pattern
        )
      );
    }
  };
  const { isSubmitting, isValidating } = form.formState;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "検索パターンを保存" : "検索パターンを編集"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "この検索条件をパターンとして保存します"
              : "パターンの名前と説明を編集できます"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleCreateOrEdit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="searchPatternName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  パターン名 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="例: 東京都内の経営者" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="searchPatternDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>説明（任意）</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="このパターンの説明を入力"
                    rows={3}
                    className="resize-none break-all max-h-60 overflow-auto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button disabled={isValidating || isSubmitting}>
              {mode === "create" ? "保存" : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
