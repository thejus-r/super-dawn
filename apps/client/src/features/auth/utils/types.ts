export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt:string
  updatedAt:string
}
export type Role = "admin" | "owner" | "editor" | "su"

export type Organization = {
  id: string;
  name: string;
  slug:string
  createdAt:string
  updatedAt:string
}

export type ValidateScopeResponse = {
  accessToken: string,
  userRole: Role,
  organizationId: string
}

export type UserWithMemberships = User & {
  memberships: {
    role: Role;
    organization: Organization
    }[]
}
