import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { organizations } from "@/db/schema";

export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export interface IOrganizationRepository {
  createOrganization: (userId: string, payload: NewOrganization) => Promise<Organization>
  getBySlug: (slug: string) => Promise<Organization | undefined>
  getById: (id: string) => Promise<Organization | undefined>
}
