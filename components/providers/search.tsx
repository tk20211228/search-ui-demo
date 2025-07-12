"use client";

import { ReactNode, createContext, useContext } from "react";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { searchPatternSchema } from "@/lib/schemas/search";
import { SearchParams } from "@/lib/types/search";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/constants/search";

type ContextType = {
  // resetToDefaults: () => void;
  // resetAdditionalKeywords: () => void;
};

const Context = createContext<ContextType>({} as ContextType);

export function SearchProvider({ children }: { children: ReactNode }) {
  const form = useForm<SearchParams>({
    resolver: zodResolver(searchPatternSchema),
    // mode: "onChange",
    defaultValues: DEFAULT_SEARCH_PARAMS,
  });
  // // 全体リセット
  // const resetToDefaults = () => {
  //   form.reset(DEFAULT_SEARCH_PARAMS);
  // };

  // // 部分リセット
  // const resetAdditionalKeywords = () => {
  //   form.setValue(
  //     "searchParams.additionalKeywords",
  //     DEFAULT_SEARCH_PARAMS.searchParams.additionalKeywords
  //   );
  // };
  return (
    <Context value={{}}>
      <Form {...form}>{children}</Form>
    </Context>
  );
}

export const useSearch = () => useContext(Context);
