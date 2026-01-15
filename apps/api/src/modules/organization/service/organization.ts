import type { IOrganizationRepository, NewOrganization } from "../domain/entity/organization";
import type { IPermissionPort } from "../domain/ports/permissions";

export class OrganizationService {
  private readonly permissionChecker: IPermissionPort
  private readonly organizationRepository: IOrganizationRepository

  constructor(permissionChecker: IPermissionPort, organizationRepository: IOrganizationRepository) {
    this.permissionChecker = permissionChecker
    this.organizationRepository = organizationRepository
  }


  createOrganization = async (userId: string, data: NewOrganization) => {
    return await this.organizationRepository.createOrganization(userId, data)
  }

  // TODO: Implement adding member
  addMember = () => {

  }

  // TODO: Implement remove member
  removeMember = () => {

  }

  // TODO: Implement change access-level of member
  updateAccessForMember = () => {

  }

  // TODO: Update organization name
  updateOrganizationName = () => {
    const userId = ""
    const orgId = ""
    const canUpdate = this.permissionChecker.can(userId, orgId, "update")

    if (!canUpdate) {

    }
  }
}
