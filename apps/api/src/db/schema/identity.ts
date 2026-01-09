import { relations } from "drizzle-orm";
import { pgTable, timestamp, unique,uuid, varchar } from "drizzle-orm/pg-core";
import { defaultTimeStamps } from "./helper";

export const users = pgTable("user_table", {
  id: uuid("_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 128 }).notNull(),
  lastName: varchar("last_name", { length: 128 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  ...defaultTimeStamps
})

export const userRelations = relations(users, ({ many }) => ({
  credentials: many(credentials)
}))

export const credentials = pgTable("credential_table", {
  id: uuid("_id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  hashSalt: varchar("hash_salt", { length: 255 }),
  ...defaultTimeStamps
},
  (t) => [unique().on(t.provider, t.providerId)],
)

export const credentialRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.userId],
    references: [users.id]
  })
}))

export const sessions = pgTable("sessions", {
  id: uuid("_id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("_created_at").defaultNow().notNull()
})

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))
