import type { PaginatedReponse } from "@/shared/types";

export type Property = {
  id: string;
  name: string;
  ownerName: string;
  ownerContact: string;
  monthlyRent: string;
  securityDeposit: string;
  authorId: string;
  organizationId: string | null;
  createAt: string;
  updatedAt: string;
  images: [];
};

export type ListOfPropertyResponse = PaginatedReponse<Property[]>;

export type PropertyFilter = {
  page?: number,
  limit?: number,
  sortBy?: string,
  sortOrder?: string,
  filters: {
    search?: string,
    minRent?: number,
    maxRent?: number,
  }
}
