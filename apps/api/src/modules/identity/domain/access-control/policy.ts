import { Action, Resource, UserRole } from "./roles";

type Permission = {
  resource: string;
  actions: (Action | string)[];
};

// Fix Super User
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SuperUser]: [
    { resource: Resource.Organization, actions: [Action.Manage] },
    { resource: Resource.User, actions: [Action.Manage] }
  ],
  [UserRole.Owner]: [
    { resource: Resource.Organization, actions: [Action.Manage] },
    { resource: Resource.User, actions: [Action.Manage] },
    { resource: Resource.Property, actions: [Action.Manage] }
  ],
  [UserRole.Admin]: [
    { resource: Resource.Organization, actions: [Action.Create, Action.Delete, Action.Read, Action.Update] },
    { resource: Resource.User, actions: [Action.Manage] }
  ],
  [UserRole.Member]: [
    { resource: Resource.Organization, actions: [Action.Read] },
    { resource: Resource.User, actions: [Action.Read] }
  ]
}

export const getPermissionsForRole = (role: UserRole): string[] => {
  const permissions = RolePermissions[role];
  if (!permissions) return [];
  const flattened: string[] = []

  permissions.forEach((p) => {
    p.actions.forEach((a) => {
      flattened.push(`${p.resource}:${a}`)
    })
  })
  return flattened
}
