import { eq } from "drizzle-orm";
import type { Database } from "@/db";
import { members, organizations } from "@/db/schema";
import type { IOrganizationRepository, NewOrganization } from "../../domain/entity/organization";

export class OrganizationRepository implements IOrganizationRepository {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  createOrganization = async (userId: string, payload: NewOrganization) => {

    const result = await this.db.transaction(async (tx) => {
      const [newOrg] = await tx.insert(organizations).values(payload).returning()

      if (!newOrg) {
        tx.rollback()
        throw new Error("unable to create organization")
      }

      await tx.insert(members).values({
        userId: userId,
        organizationId: newOrg.id,
        role: "owner"
      })

      return newOrg

    })

    return result

  }

  getBySlug = async (slug: string) => {
    return await this.db.query.organizations.findFirst({
      where: eq(organizations.slug, slug)
    })
  };

  getById = async (id: string) => {
    return await this.db.query.organizations.findFirst({
      where: eq(organizations.id, id)
    })
  };

}
