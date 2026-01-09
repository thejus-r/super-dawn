import { eq } from "drizzle-orm";
import type { DrizzleDB } from "@/db";
import { sessions } from "@/db/schema";
import type { NewSession } from "../../domain/entity/session.entity";

export class SessionRepository {
  private db: DrizzleDB

  constructor(db: DrizzleDB) {
    this.db = db
  }

  create = async (data: NewSession) => {
    return this.db.insert(sessions).values(data).returning()
  }

  findWithToken = async (token: string) => {
    return await this.db.query.sessions.findFirst({
      where: eq(sessions.token, token)
    })
  }

  revoke = async (token: string) => {
    await this.db.update(sessions).set({
      revokedAt: new Date()
    }).where(eq(sessions.id, token))
  }

  revokeAll = async (userId: string) => {
    await this.db.update(sessions).set({
      revokedAt: new Date(),
    }).where(eq(sessions.userId, userId))
  }
}
