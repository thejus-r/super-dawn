import { media } from "@/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;
