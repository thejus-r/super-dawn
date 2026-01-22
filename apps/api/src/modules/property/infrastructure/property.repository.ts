import type { Database } from "@/db";
import { properties, propertyImages } from "@/db/schema/property";
import type {
  IPropertyRepository,
  NewPropertyWithImage,
} from "../domain/entity/property.entity";
import { and, eq, inArray } from "drizzle-orm";

export class PropertyRepository implements IPropertyRepository {
  constructor(private readonly db: Database) {}

  create = async (payload: NewPropertyWithImage) => {
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

      const imageInserts = payload.images.map((image) => ({
        mediaId: image.mediaId,
        propertyId: createdProperty.id,
      }));

      const createdImages = await tx
        .insert(propertyImages)
        .values(imageInserts)
        .returning();

      return { ...createdProperty, images: createdImages };
    });

    if (!newProperty) {
      throw new Error("unable to create new property");
    }
    return newProperty;
  };

  listAll = async (userId: string) => {
    const res = this.db.query.properties.findMany({
      where({ authorId }, { and, eq }) {
        return and(eq(authorId, userId));
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

    return res;
  };

  update = async (id: string, payload: NewPropertyWithImage) => {
    await this.db.transaction(async (tx) => {
      await tx.update(properties).set({
        ...payload,
      });

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

    const [updatedProperty] = await this.db
      .update(properties)
      .set({
        ...payload,
      })
      .returning();

    if (!updatedProperty) {
      throw new Error("unable to update property");
    }
  };
}
