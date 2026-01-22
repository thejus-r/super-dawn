import type {
  IPropertyRepository,
  IPropertyService,
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

    const res = await this.propertyRepo.create({
      ...payload,
      authorId: userId,
      organizationId: orgId,
      images: payload.images.map((image) => ({
        mediaId: image.id,
      })),
    });

    return res;
  };

  update = async ({
    userId,
    orgId,
    payload,
    propertyId,
  }: {
    userId: string;
    orgId?: string;
    propertyId: string;
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

    await this.propertyRepo.update(propertyId, {
      ...payload,
      authorId: userId,
      organizationId: orgId,
      images: payload.images.map((image) => ({
        mediaId: image.id,
      })),
    });

    return {
      success: "ok",
    };
  };

  list = async ({ userId }: { userId: string }) => {
    return await this.propertyRepo.listAll(userId);
  };
}
