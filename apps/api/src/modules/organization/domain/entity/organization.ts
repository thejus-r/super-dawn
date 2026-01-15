import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { organizations } from "@/db/schema";



export type Organization = InferSelectModel<typeof organizations>;
export type NewOrganization = InferInsertModel<typeof organizations>;

export interface IOrganizationRepository {
  createOrganization: (userId: string, payload: NewOrganization) => Promise<Organization>
}
