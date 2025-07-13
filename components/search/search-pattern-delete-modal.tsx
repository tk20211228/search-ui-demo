"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { searchPattern } from "@/lib/types/search";
import { RouteParams } from "@/lib/types/utils";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import useLocalStorageState from "use-local-storage-state";
import { useSearch } from "../providers/search";

interface SearchPatternDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
}

export function SearchPatternDeleteModal({
  isOpen,
  onClose,
}: SearchPatternDeleteModalProps) {
  const [searchPatterns, setSearchPatterns] = useLocalStorageState<
    searchPattern[] | []
  >("searchPatterns", {
    defaultValue: [],
  });
  const router = useRouter();
  const params = useParams<RouteParams>();
  const searchId = params.searchId;
  const { setSearchPattern } = useSearch();

  const handleDelete = () => {
    console.log("handleDelete", searchId);
    const newSearchPatterns = searchPatterns.filter(
      (pattern) => pattern.id !== searchId
    );
    setSearchPatterns(newSearchPatterns);
    setSearchPattern(null);
    router.push("/customer-searches");
    toast.success("検索パターンを削除しました");

    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>検索パターンを削除</AlertDialogTitle>
          <AlertDialogDescription>
            この検索パターンを削除します。 この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            削除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
