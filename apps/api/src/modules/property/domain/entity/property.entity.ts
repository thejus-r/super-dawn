import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { properties, propertyImages, media } from "@/db/schema";
import type { CreatePropertyPayload } from "../../interface/dto/property.dto";

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;

export type PropertyImage = InferInsertModel<typeof propertyImages>;

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;

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
  listAll: (userId: string) => Promise<PropertyWithImage[]>;
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

  list: ({ userId }: { userId: string }) => Promise<Property[]>;
};
