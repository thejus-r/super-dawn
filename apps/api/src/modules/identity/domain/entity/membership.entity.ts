import type { Organization } from "@/modules/organization/domain/entity/organization";
import type { UserRole } from "../access-control/roles";
import type { MemberByOrg } from "../auth.domain";
import type { User } from "./user.entity";

type Membership = {
  role: UserRole,
  user: User,
  organization: Organization
}

export interface IMembershipRepository {
  findUserRoles: (userId: string, orgId: string) => Promise<UserRole | null>
  findMemberByOrgSlug: (userId: string, orgSlug: string) => Promise<MemberByOrg | null>
  findByIds: (userId: string, orgSlug: string) => Promise<Membership | null>
}
