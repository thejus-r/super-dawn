import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { credentials } from "@/db/schema";

export type Credentials = InferSelectModel<typeof credentials>;
export type NewCredentials = InferInsertModel<typeof credentials>;
