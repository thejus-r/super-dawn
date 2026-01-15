import type { AccessControlService } from "@/modules/identity/services/access-control.service";
import type { IPermissionPort } from "@/modules/organization/domain/ports/permissions";

export class IdentityOrganizationAdapter implements IPermissionPort{
  constructor(
    private readonly accessService: AccessControlService
  ) { }

  async can(userId: string, organizationId: string, action: string): Promise<boolean> {
    return this.accessService.can(userId, organizationId, action, "organization")
  }
}
