import type { Organization } from "@/modules/organization/domain/entity/organization";
import type {
  CreateUserInput,
  LoginUserInput,
} from "../interface/dto/auth.dto";
import type { UserRole } from "./access-control/roles";
import type { User } from "./entity/user.entity";

type AuthResult = {
  user: User;
  refreshToken: string;
  accessToken: string;
};

type UserWithOrgs = User & {
  memberships: {
    role: UserRole,
    organization: Organization
    }[]
}

export type MemberByOrg = {
  userId: string;
  organizationId: string;
  role: UserRole;
  slug: string;
}

export type Token = {
  accessToken: string,
  userRole: string,
  organizationId: string | undefined
}

export type IAuthService = {
  createUser: (payload: CreateUserInput) => Promise<AuthResult>;
  loginUser: (payload: LoginUserInput) => Promise<AuthResult>;
  logoutUser: (incomingToken: string) => Promise<void>;
  refreshTokens: (incomingToken: string, orgId: string | null) => Promise<AuthResult>;
  findUserWithId: (userId: string) => Promise<UserWithOrgs | undefined>,
  switchOrganization: (userId: string, orgId?: string) => Promise<Token>
};

export type IAuthRepository = {
  createUser: () => void;
  loginUser: () => void;
  refreshTokens: () => void;
};
