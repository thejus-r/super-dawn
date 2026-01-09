import { eq,and } from "drizzle-orm";
import type { Database, DrizzleDB, TxOrDB } from "@/db";
import { credentials, users } from "@/db/schema";
import type { NewCredentials } from "../../domain/entity/credential.entity";
import type { NewUser } from "../../domain/entity/user.entity";

export class AuthRepository {
  private db: DrizzleDB;

  constructor(db: Database) {
    this.db = db;
  }

  create = async (userData: NewUser, credentialData: Omit<NewCredentials, "userId">) => {
    return await this.db.transaction(async (tx) => {
      const [newUser] = await tx.insert(users).values(userData).returning();

      if (!newUser) {
        tx.rollback()
        throw new Error("Failed to create user");
      }

      await tx.insert(credentials).values({
        ...credentialData,
        userId: newUser.id
      })
      return newUser
    })
  };

  findUserByProvider = async (provider: string, providerId: string) => {
    const credential = await this.db.query.credentials.findFirst({
      where: and(
        eq(credentials.provider, provider),
        eq(credentials.providerId, providerId)
      ),
      with: {
        user: true
      }
    })

    return credential ? credential.user : null
  }

  findByEmailWithIdentities = async (email: string) => {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        credentials: true
      }
    });
  };
}
