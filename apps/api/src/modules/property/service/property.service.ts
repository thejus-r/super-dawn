import type {
  IPropertyRepository,
  IPropertyService,
  Property,
} from "../domain/entity/property.entity";
import type { IOrganizationGateway } from "../domain/ports/organization.gateway";
import type { CreatePropertyPayload } from "../interface/dto/property.dto";

export class PropertyService implements IPropertyService {
  constructor(
    private readonly orgGateway: IOrganizationGateway,
    private readonly propertyRepo: IPropertyRepository,
  ) {}

  create = async ({
    userId,
    orgId,
    payload,
  }: {
    userId: string;
    orgId?: string;
    payload: CreatePropertyPayload;
  }) => {
    if (orgId) {
      const orgExists = await this.orgGateway.exists(orgId);
      if (!orgExists) {
        throw new Error("Organization not found");
      }

      const hasPermission = await this.orgGateway.canCreateProperty(
        userId,
        orgId,
      );
      if (!hasPermission) {
        throw new Error(
          "Permission Denied: You cannot create properties in this organization.",
        );
      }
    }

    return await this.propertyRepo.create({
      ...payload,
      authorId: userId,
      organizationId: orgId,
    });
  };

  list = async ({ userId }: { userId: string }) => {
    return await this.propertyRepo.listAll(userId);
  };
}
