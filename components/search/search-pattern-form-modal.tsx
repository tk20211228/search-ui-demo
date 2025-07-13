"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { searchPattern } from "@/lib/types/search";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { useSearch } from "../providers/search";

interface SearchPatternFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  currentDescription?: string;
  mode: "create" | "edit";
}

export function SearchPatternFormModal({
  isOpen,
  onClose,
  mode,
}: SearchPatternFormModalProps) {
  const form = useFormContext<searchPattern>();
  const { setSearchPatterns } = useSearch();
  const router = useRouter();
  const isNew = mode === "create";

  const handleCreateOrEdit = (formData: searchPattern) => {
    if (isNew) {
      const searchId = crypto.randomUUID();
      formData.id = searchId;
      formData.userId = "demo-user";
      formData.createdAt = new Date().toISOString();
      formData.updatedAt = new Date().toISOString();
      setSearchPatterns((prev) => [...prev, formData]);
      router.push(`/customer-searches/${searchId}`);
      // 履歴を置き換えてURLを変更（画面更新なし）
      // window.history.replaceState(null, "", `/customer-searches/${searchId}`);
      toast.success("検索パターンを保存しました");
    } else {
      formData.updatedAt = new Date().toISOString();
      setSearchPatterns((prev) =>
        prev.map((pattern) => (pattern.id === formData.id ? formData : pattern))
      );
      toast.success("検索パターンを更新しました");
    }
    onClose();
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
