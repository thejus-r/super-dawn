import type { Database } from "@/db";
import type { IMembershipRepository } from "../../domain/entity/membership.entity";

export class MembershipRepository implements IMembershipRepository {
  private db: Database

  constructor(db: Database) {
    this.db = db
  }

  findUserRoles = async (userId: string, orgId: string) => {
    const result = await this.db.query.members.findFirst({
      where: (members, { eq, and }) => and(
        eq(members.userId, userId),
        eq(members.organizationId, orgId)
      ),
      columns: {
        role: true
      }
    })

    if (!result) {
      return null
    }

    return result.role
  }
}
