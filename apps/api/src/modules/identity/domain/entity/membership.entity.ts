import type { UserRole } from "../access-control/roles";

export interface IMembershipRepository {
  findUserRoles: (userId: string, orgId: string) => Promise< UserRole | null>
}
