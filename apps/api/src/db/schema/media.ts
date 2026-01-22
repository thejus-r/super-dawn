import { pgTable, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { defaultTimeStamps } from "./helper";
import { relations } from "drizzle-orm";
import { propertyImages } from "./property";

export const media = pgTable("media_table", {
  id: uuid("_id").primaryKey().defaultRandom(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 50 }).notNull(),
  variants: jsonb("variants").default([]),
  ...defaultTimeStamps,
});

export const mediaRelations = relations(media, ({ one }) => ({
  property: one(propertyImages, {
    fields: [media.id],
    references: [propertyImages.mediaId],
  }),
}));
