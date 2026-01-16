import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { defaultTimeStamps } from "./helper";
import { users } from "./identity";

export const organizations = pgTable("organization_table", {
  id: uuid("_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 28 }).unique().notNull(),
  ...defaultTimeStamps,
}, (table) => [
  index("slug_idx").on(table.slug)
]);

export const roleEnum = pgEnum("role", ["su", "owner", "admin", "member"]);

export const members = pgTable(
  "member_table",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    role: roleEnum("role").default("member").notNull(),
    ...defaultTimeStamps,
  },
  (t) => [primaryKey({ columns: [t.organizationId, t.userId] })],
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
}));
