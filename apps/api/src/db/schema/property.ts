import { relations } from "drizzle-orm";
import {
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defaultTimeStamps } from "./helper";
import { users } from "./identity";
import { organizations } from "./organization";

export const properties = pgTable("property_table",{
  id: uuid("_id").primaryKey().defaultRandom(),
  name: varchar("name", {length: 255 }),
  ownerName: varchar("owner_name", {length: 255 }),
  ownerContact: varchar("owner_contact", { length: 255 }),
  monthlyRent: numeric("monthly_rent"),
  securityDeposit: numeric("security_deposit"),
  organizationId: uuid("organization_id").references(() => organizations.id),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  ...defaultTimeStamps
})

export const propertyRelations = relations(properties, ({ one }) => ({
  author: one(users, {
    fields: [properties.authorId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [properties.organizationId],
    references: [organizations.id]
  })
})
)
