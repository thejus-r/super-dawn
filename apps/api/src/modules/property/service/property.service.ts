import { AppError } from "@/shared/utils/AppError";
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

    return
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

    // Check if the user has permission
    if (organizationId) {
      const can = await this.orgGateway.canReadProperty(userId, organizationId)
      if (!can) {
        throw new AppError({
          message: 'requires elevated permission',
          statusCode: 403
        })
      }
      finalFilter.organizationId = organizationId
    } else {
      // Organization = null, helps to filter out properties without organization
      // i.e for personal workspace
      finalFilter.organizationId = null
      finalFilter.authorId = userId
    }

    const { data, count: totalItems } =  await this.propertyRepo.listAll({
      ...options,
      filters: finalFilter
    })

    // Calculate meta data
    const page = options.page || 1;
    const limit = options.limit || 10;
    const totalPages = Math.ceil(totalItems / limit);

    // Mapping as required by response
    const reponseData = data.map(property => {
      return {
        ...property,
        images: property.images.map(image => image.image)
      }
    })

    return {
      data: reponseData,
      meta: {
        current_page: page,
        page_size: limit,
        total_items: totalItems,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_previous_page: page > 1
      }
    }
  };

  delete = async ({ propertyId }: { propertyId: string }) => {
    console.log("service", "deleting ", propertyId);
    await this.propertyRepo.delete(propertyId);
  };
}
