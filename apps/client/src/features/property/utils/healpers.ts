import type { PropertyFilter } from "./types";

export const flattenFilters = (data: PropertyFilter) => {
  const { filters, ...rest } = data;
  const combined = {
    ...rest,
    ...filters
  }

  const flatten = Object.entries(combined).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  return Object.fromEntries(flatten)
};
