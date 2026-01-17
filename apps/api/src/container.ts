import { db } from "./db";
import { IdentityOrganizationAdapter } from "./infrastructure/adapters/identity-organization.adapter";
import { OrganizationPropertyAdapter } from "./infrastructure/adapters/organization-property.adapter";
import { AuthRepository } from "./modules/identity/infrastructure/repository/auth.repository";
import { MembershipRepository } from "./modules/identity/infrastructure/repository/membership.repository";
import { SessionRepository } from "./modules/identity/infrastructure/repository/session.repository";
import { AccessControlService } from "./modules/identity/services/access-control.service";
import { AuthService } from "./modules/identity/services/auth.service";
import { OrganizationRepository } from "./modules/organization/infrastructure/repository/organization.repo";
import { OrganizationService } from "./modules/organization/service/organization";
import { PropertyRepository } from "./modules/property/infrastructure/property.repository";
import { PropertyService } from "./modules/property/service/property.service";

export const createContainer = () => {
  // Repositories
  const authRepo = new AuthRepository(db);
  const sessionRepo = new SessionRepository(db);
  const membershipRepo = new MembershipRepository(db);
  const organizationRepo = new OrganizationRepository(db);
  const propertyRepo = new PropertyRepository(db);

  // Shared Services
  const accessControlService = new AccessControlService(membershipRepo);
  const orgGateway = new OrganizationPropertyAdapter(
    organizationRepo,
    accessControlService,
  );

  // Services
  const authService = new AuthService(authRepo, sessionRepo);
  const propertyService = new PropertyService(orgGateway, propertyRepo);

  const orgIdentityAdapter = new IdentityOrganizationAdapter(
    accessControlService,
  );
  const organizationService = new OrganizationService(
    orgIdentityAdapter,
    organizationRepo,
  );
  return {
    organization: {
      service: {
        organization: organizationService,
      },
    },
    property: {
      service: {
        property: propertyService,
      },
    },
    identity: {
      service: {
        accessControlService,
        authService,
      },
    },
  };
};

export type Container = ReturnType<typeof createContainer>;
