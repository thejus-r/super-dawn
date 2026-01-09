import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { sessions } from "@/db/schema";

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;
