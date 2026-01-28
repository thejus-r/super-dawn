import { and, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { members, organizations } from "@/db/schema";
import type { IMembershipRepository } from "../../domain/entity/membership.entity";

export class MembershipRepository implements IMembershipRepository {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  findMemberByOrgSlug = async (userId: string, orgSlug: string) => {
    const [result] = await this.db.select({
      userId: members.userId,
      organizationId: members.organizationId,
      role: members.role,
      slug: organizations.slug
    }).from(members)
      .innerJoin(organizations, eq(members.organizationId, organizations.id))
      .where(
        and(
          eq(members.userId, userId),
          eq(organizations.slug, orgSlug)
        )
      )
      .limit(1)

    return result || null
  }

  findByIds = async (userId: string, organizationId: string) => {
    const result = await this.db.query.members.findFirst({
      where: and(
        eq(members.userId, userId),
        eq(members.organizationId, organizationId)
      ),
      columns: {
        role: true
      },
      with: {
        organization: true,
        user: true
      }
    })

    return result ?? null
  }

  findUserRoles = async (userId: string, orgId: string) => {
    const result = await this.db.query.members.findFirst({
      where: (members, { eq, and }) => and(
        eq(members.userId, userId),
        eq(members.organizationId, orgId)
      ),
      columns: {
        role: true
      },
      with: {
        organization: true
      }
    })

    if (!result) {
      return null
    }

    return result.role
  }
}
