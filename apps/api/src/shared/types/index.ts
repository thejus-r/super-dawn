export type PaginationMetaData = {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next_page: boolean,
  has_previous_page: boolean
}

export type PaginatedReponse<T> = {
  data: T,
  meta: PaginationMetaData
}
