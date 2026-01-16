import type { IOrganizationGateway } from "../domain/ports/organization.gateway"

export class PropertyService {

  constructor(
    private readonly orgGateway: IOrganizationGateway
  ) {}

  create = async (userId: string, orgId?: string) => {
    if (orgId) {
      const orgExists = await this.orgGateway.exists(orgId)
      if (!orgExists) {
        throw new Error("Organization not found");
      }

      const hasPermission = await this.orgGateway.canCreateProperty(userId, orgId)
      if (!hasPermission) {
        throw new Error("Permission Denied: You cannot create properties in this organization.")
      }
    }

  }

  update = () => {

  }

  deletea = () => {

  }
}
