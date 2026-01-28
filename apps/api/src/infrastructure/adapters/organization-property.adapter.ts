import type { AccessControlService } from "@/modules/identity/services/access-control.service";
import type { IOrganizationRepository } from "@/modules/organization/domain/entity/organization";
import type { IOrganizationGateway } from "@/modules/property/domain/ports/organization.gateway";

export class OrganizationPropertyAdapter implements IOrganizationGateway {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
    private readonly accessService: AccessControlService
  ) { }

  canReadProperty = async (userId: string, orgId: string): Promise<boolean> => {
    return await this.accessService.can(userId, orgId, "read", "property")
  }

  canCreateProperty = async (userId: string, orgId: string): Promise<boolean> => {
    return await this.accessService.can(userId, orgId, "create", "property")
  }

  exists = async (orgId: string): Promise<boolean> => {
    const existingOrg = await this.orgRepo.getById(orgId)
    return !!existingOrg
  }
}
