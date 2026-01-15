// 1. Define the constant objects

export const UserRole = {
	SuperUser: "su",
	Owner: "owner",
	Admin: "admin",
	Member: "member",
} as const;

export const Resource = {
	Organization: "organization",
	User: "user",
} as const;

export const Action = {
	Create: "create",
	Read: "read",
	Update: "update",
	Delete: "delete",
	Manage: "manage",
} as const;

// 2. Derive the types (so you can use 'UserRole' as a type)
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type Resource = (typeof Resource)[keyof typeof Resource];
export type Action = (typeof Action)[keyof typeof Action];
