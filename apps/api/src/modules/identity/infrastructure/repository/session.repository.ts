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
    return this.db.insert(sessions).values(data)
  }

  findWithToken = async (token: string) => {
    return await this.db.query.sessions.findFirst({
      where: eq(sessions.token, token),
      with: {
        user: true
      }
    })
  }

  async insertAndRevoke(sessionRecord: NewSession, sessionId: string) {
    return await this.db.transaction(async (tx) => {
      const [newSession] = await tx.insert(sessions).values({
        ...sessionRecord,
      }).returning({
        id: sessions.id
      })

      if (!newSession) {
        tx.rollback()
        throw new Error("unable to create new session")
      }

      await tx.update(sessions).set({
        revokedAt: new Date()
      }).where(eq(sessions.id, sessionId))
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
