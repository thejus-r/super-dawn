import type {
  IPropertyRepository,
  IPropertyService,
  PropertyQueryOptions,
} from "../domain/entity/property.entity";
import type { IOrganizationGateway } from "../domain/ports/organization.gateway";
import type { CreatePropertyPayload } from "../interface/dto/property.dto";

export class PropertyService implements IPropertyService {
  constructor(
    private readonly orgGateway: IOrganizationGateway,
    private readonly propertyRepo: IPropertyRepository,
  ) {}

  getById = async ({ propertyId }: { propertyId: string }) => {
    return this.propertyRepo.getById({ propertyId });
  };

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

  list = async ({
    userId,
    organizationId,
    options
  }: {
    userId: string,
    organizationId?: string,
    options: PropertyQueryOptions
  }) => {

    const finalFilter = {
      ...options.filters
    }


    if (organizationId) {
      // const can = await this.permissionChecker.can(userId, organizationId, "READ")
      // if (!can) {
      //   throw new AppError({
      //     message: 'requires elevated permission',
      //     statusCode: 403
      //   })
      // }
      finalFilter.organizationId = organizationId
    } else {
      finalFilter.organizationId = null
      finalFilter.authorId = userId
    }

      const properties =  await this.propertyRepo.listAll({
        ...options,
        filters: finalFilter
      })


    return properties.map(property => {
      return {
        ...property,
        images: property.images.map(image => image.image)
      }
    })
  };

  delete = async ({ propertyId }: { propertyId: string }) => {
    console.log("service", "deleting ", propertyId);
    await this.propertyRepo.delete(propertyId);
  };
}
