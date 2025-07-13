"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { searchPatternSchema } from "@/lib/schemas/search";
import { searchPattern } from "@/lib/types/search";
import { DEFAULT_SEARCH_PARAMS } from "@/lib/constants/search";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { RouteParams } from "@/lib/types/utils";
import useLocalStorageState from "use-local-storage-state";

type ContextType = {
  searchPattern: searchPattern | null;
  setSearchPattern: (pattern: searchPattern | null) => void;
  searchPatterns: searchPattern[];
  setSearchPatterns: (
    patterns: searchPattern[] | ((prev: searchPattern[]) => searchPattern[])
  ) => void;
};

const Context = createContext<ContextType>({} as ContextType);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchPattern, setSearchPattern] = useState<searchPattern | null>(
    null
  );
  const router = useRouter();
  const params = useParams<RouteParams>();
  const searchId = params.searchId;
  // console.log("SearchProvider searchId", searchId);

  const form = useForm<searchPattern>({
    resolver: zodResolver(searchPatternSchema),
    // mode: "onChange",
    defaultValues: DEFAULT_SEARCH_PARAMS,
  });

  const [searchPatterns, setSearchPatterns] = useLocalStorageState<
    searchPattern[]
  >("searchPatterns-new", {
    defaultValue: [],
  });

  const searchParams = useSearchParams();
  const customerName = searchParams.get("customerName");

  useEffect(() => {
    if (searchPatterns.length > 0) {
      const pattern = searchPatterns.find((pattern) => pattern.id === searchId);
      if (pattern) {
        if (customerName) {
          pattern.searchParams.customerName = customerName;
        }
        form.reset(pattern);
        setSearchPattern(pattern);
      }
    }
  }, [searchPatterns, searchId]);

  return (
    <Context
      value={{
        searchPattern,
        setSearchPattern,
        searchPatterns,
        setSearchPatterns,
      }}
    >
      <Form {...form}>{children}</Form>
    </Context>
  );
}

export const useSearch = () => useContext(Context);
