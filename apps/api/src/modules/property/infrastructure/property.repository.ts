import { and,asc, desc, eq, ilike, inArray, isNull, type SQL } from "drizzle-orm";
import type { Database } from "@/db";
import { properties, propertyImages } from "@/db/schema/property";
import type {
  IPropertyRepository,
  NewPropertyWithImage,
  PropertyFilterOptions,
  PropertyQueryOptions,
  PropertySortField,
  SortOrder,
} from "../domain/entity/property.entity";

export class PropertyRepository implements IPropertyRepository {
  constructor(private readonly db: Database) {}

  listAll = async (options: PropertyQueryOptions = {}) => {

    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = "createdAt",
      sortOrder = "desc"
    } = options
    const offset = (page - 1) * limit

    const whereConditions = this.buildWhereClause(filters)

    const orderByClause = this.buildOrderByClause(sortBy, sortOrder)

    const res = await this.db.query.properties.findMany({
      where: whereConditions,
      limit: limit,
      offset: offset,
      orderBy: orderByClause,
      with: {
        images: {
          columns: {},
          with: {
            image: true
          }
        }
      }
    })

    return res
  };

  create = async (payload: NewPropertyWithImage) => {
    try {
      const newProperty = await this.db.transaction(async (tx) => {
        const [createdProperty] = await tx
          .insert(properties)
          .values({
            ...payload,
          })
          .returning();

        if (!createdProperty) {
          tx.rollback();
          throw new Error("unable to create property");
        }

        // insert images only if there are images in the payload
        const imageInserts = payload.images.map((image) => ({
          mediaId: image.mediaId,
          propertyId: createdProperty.id,
        }));

        if (imageInserts.length > 0) {
          const createdImages = await tx
            .insert(propertyImages)
            .values([...imageInserts])
            .returning();

          return {
            ...createdProperty,
            images: createdImages,
          };
        }

        return { ...createdProperty, images: [] };
      });

      if (!newProperty) {
        throw new Error("unable to create new property");
      }
      return newProperty;
    } catch (err) {
      console.error(err);
      throw new Error("error");
    }
  };

  getById = async ({ propertyId }: { propertyId: string }) => {
    const result = await this.db.query.properties.findFirst({
      where({ id }, { eq }) {
        return eq(id, propertyId);
      },
      with: {
        images: {
          columns: {},
          with: {
            image: true,
          },
        },
      },
    });

    return result ?? null;
  };

  update = async (id: string, payload: NewPropertyWithImage) => {
    await this.db.transaction(async (tx) => {
      await tx.update(properties).set({
        ...payload,
      }).where(eq(properties.id, id));

      const existingImages = await tx.query.propertyImages.findMany({
        where: eq(propertyImages.propertyId, id),
      });

      const incomingMediaIds = payload.images.map((img) => img.mediaId);
      const existingMediaIds = existingImages.map((row) => row.mediaId);

      // Images To Add, not exisiting in DB, added by user
      const toInsert = incomingMediaIds.filter(
        (id) => !existingMediaIds.includes(id),
      );

      // Removed ImageId, exisiting in DB, but removed by user
      const toDelete = existingMediaIds.filter(
        (id) => !incomingMediaIds.includes(id),
      );

      if (toDelete.length > 0) {
        await tx
          .delete(propertyImages)
          .where(
            and(
              eq(propertyImages.propertyId, id),
              inArray(propertyImages.mediaId, toDelete),
            ),
          );
      }

      if (toInsert.length > 0) {
        await tx.insert(propertyImages).values(
          toInsert.map((mediaId) => ({
            mediaId: mediaId,
            propertyId: id,
          })),
        );
      }
    });
  };

  delete = async (propertyId: string): Promise<void> => {
    try {
      console.log("deleting", propertyId);
      await this.db.transaction(async (tx) => {
        await tx
          .delete(propertyImages)
          .where(eq(propertyImages.propertyId, propertyId));
        await tx.delete(properties).where(eq(properties.id, propertyId));
      });
    } catch (err) {
      console.error(err);
    }
  };
  /**
  * Helps build the queries for the filtering of properties
  * @param filters
  * @returns
  */
  private buildWhereClause = (
    filters: PropertyFilterOptions,
  ): SQL | undefined => {
    const conditions: SQL[] = [];

    if (filters.search) {
      conditions.push(ilike(properties.name, `%${filters.search}`))
    }

    if (filters.authorId) {
      conditions.push(eq(properties.authorId, filters.authorId))
    }

    if (filters.organizationId !== undefined) {
      // for personal space
      if (filters.organizationId === null) {
        conditions.push(isNull(properties.organizationId))
      } else {
        // scoped to organization only
        conditions.push(eq(properties.organizationId, filters.organizationId))
      }
    }

    return conditions.length > 0 ? and(...conditions): undefined
  };

  /**
  * Helps to build the sorting column and sorting order for properties
  * @param sortBy
  * @param sortOrder
  * @returns
  */
  private buildOrderByClause = (
    sortBy: PropertySortField,
    sortOrder: SortOrder
  ) => {
    const sortColumn = this.getSortColumn(sortBy)
    return sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn)
  }

  /**
  * Helps to assign table column to input column
  * @param field
  * @returns
  */
  private getSortColumn = (field: PropertySortField) => {
    switch (field) {
      case "monthlyRent":
      return properties.monthlyRent
      case "name":
      return properties.name
      case "updatedAt":
      return properties.updatedAt
      default:
      return properties.createdAt
    }
  }
}
