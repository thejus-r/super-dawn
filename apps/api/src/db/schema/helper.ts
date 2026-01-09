import { timestamp } from "drizzle-orm/pg-core";

export const defaultTimeStamps = {
  createdAt: timestamp("_created_at").defaultNow().notNull(),
  updatedAt: timestamp("_updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
};
