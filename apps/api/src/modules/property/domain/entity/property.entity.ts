import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { properties } from "@/db/schema/property";
import type { CreatePropertyPayload } from "../../interface/dto/property.dto";

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;

export interface IPropertyRepository {
  create: (payload: NewProperty) => Promise<Property>;
  update: (payload: NewProperty) => Promise<Property>;
  listAll: (userId: string) => Promise<Property[]>;
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
  }) => Promise<Property>;

  list: ({ userId }: { userId: string }) => Promise<Property[]>;
};
