import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import type { PropertySearch } from "../utils/schema";

export const usePropertyFilters = () => {
  const search = useSearch({
    from: "/_protected/$scopeId/property",
    strict: true,
  });
  const navigate = useNavigate({ from: "/$scopeId/property" });

  // default filters and sort
  const DEFAULTS: PropertySearch = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "asc"
  }
  const filters = useMemo(() => ({
    page: search.page ?? DEFAULTS.page,
    limit: search.limit ?? DEFAULTS.limit,
    sortBy: search.sortBy ?? DEFAULTS.sortBy,
    sortOrder: search.sortOrder ?? DEFAULTS.sortOrder,
    filters: {
      search: search.search,
      minRent: search.minRent,
      maxRent: search.maxRent,
    },
  }), [search])

  const setFilters = (
    updater: (prev: PropertySearch) => Partial<PropertySearch>,
  ) => {
    navigate				({
      search: (prev) => {
        const next = updater(prev);
        return {
          ...prev,
          ...next,
          page:
          next.search !== undefined && next.search !== prev.search
          ? 1
          : (next.page ?? prev.page),
        };
      },
      replace: true,
    })
  };

  return { filters, setFilters }
};
