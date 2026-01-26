import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { media, properties, propertyImages } from "@/db/schema";
import type { CreatePropertyPayload } from "../../interface/dto/property.dto";

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;

export type PropertyImage = InferInsertModel<typeof propertyImages>;

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;

export type PropertySortField = "monthlyRent" | "createdAt" | "updatedAt" | "name";
export type SortOrder = "asc" | "desc"

export interface PropertyFilterOptions {
  search?: string;
  propertyType?: string | string[];
  authorId?: string;
  organizationId?: string | null;
  minRent?: number;
  maxRent?: number;
}

export interface PropertyQueryOptions {
  page?: number,
  limit?: number;
  filters?: PropertyFilterOptions;
  sortBy?: PropertySortField;
  sortOrder?: SortOrder
}

export type NewPropertyWithImage = NewProperty & {
  images: {
    mediaId: string;
    }[];
};

export type PropertyWithImageRecord = Property & {
  images: PropertyImage[];
};

export type PropertyWithImage = Property & {
  images: {
    image: Media;
    }[];
};

export interface IPropertyRepository {
  create: (payload: NewPropertyWithImage) => Promise<PropertyWithImageRecord>;
  update: (id: string, payload: NewPropertyWithImage) => Promise<void>;
  listAll: (options: PropertyQueryOptions) => Promise<PropertyWithImage[]>;
  getById: ({
    propertyId,
  }: {
    propertyId: string;
  }) => Promise<PropertyWithImage | null>;

  delete: (propertyId: string) => Promise<void>;
}

export type IPropertyService = {
  create: ({
    userId,
    orgId,
    payload,
  }: {
    userId: string;
    orgId?: string;
    payload: CreatePropertyPayload;
  }) => Promise<PropertyWithImageRecord>;

  list: ({
    userId,
    organizationId,
    options
  }: {
    userId: string;
    organizationId?: string;
    options: PropertyQueryOptions;
  }) => Promise<Property[]>;

  getById: ({
    propertyId,
  }: {
    propertyId: string;
  }) => Promise<PropertyWithImage | null>;

  delete: ({ propertyId }: { propertyId: string }) => Promise<void>;
  update: ({ propertyId, payload }: { propertyId: string, payload: CreatePropertyPayload }) => Promise<void>;
};
