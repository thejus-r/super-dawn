import { getPermissionsForRole, RolePermissions } from "../domain/access-control/policy"
import { Action } from "../domain/access-control/roles"
import type { IMembershipRepository } from "../domain/entity/membership.entity"

export class AccessControlService {
  private readonly membershipRepo: IMembershipRepository

  constructor(membershipRepo: IMembershipRepository) {
    this.membershipRepo = membershipRepo
  }

  // For Internal Use
  can = async (userId: string, orgId: string, action: string, resource: string): Promise<boolean> => {
    const role = await this.membershipRepo.findUserRoles(userId, orgId)

    if (!role) {
      return false
    }

    const policy = RolePermissions[role]

    if (!policy) {
      return false
    }

    return policy.some((p) => {
      const resourceMatch = p.resource === resource;
      const actionMatch = p.actions.includes(action as Action) || p.actions.includes(Action.Manage);
      return resourceMatch && actionMatch;
    })

  }

  // User for /permission endpoint, for client side
  // maybe find better way to improve it later
  getPermissions = async (userId: string, orgId: string) => {
    const role = await this.membershipRepo.findUserRoles(userId, orgId)

    if (!role) {
      return {
        role: null,
        permissions: []
      }
    }

    return {
      role: role,
      permissions: getPermissionsForRole(role)
    }
  }
}
