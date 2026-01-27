import { eq } from "drizzle-orm";
import type { Database } from "@/db";
import { media } from "@/db/schema";
import type { NewMedia } from "../../domain/entities/MediaEntity";
import type { IMediaRepository } from "../../domain/repository/IMediaRepository";

export class MediaRepository implements IMediaRepository {
  constructor(private readonly db: Database) {}

  /**
   * Save media into database
   */
  save = async (data: NewMedia) => {
    const [result] = await this.db.insert(media).values(data).returning();

    if (!result) {
      throw new Error("unable to insert media into database");
    }

    return result;
  };

  /**
   * get media by id
   */
  getById = async (id: string) => {
    const result = await this.db.query.media.findFirst({
      where: eq(media.id, id),
    });

    if (!result) {
      return null;
    }

    return result;
  };

  /**
   * First check if already exists, then only we will insert,
   * we ignore all upsert requests
   *
   * TODO: Update this "exisits" to a middleware in controller level
   */

  update = async (id: string, data: Partial<NewMedia>) => {
    const existingMedia = this.getById(id);

    if (!existingMedia) {
      console.log("[INFO] updating data that does not exsits: ", id);
      return null;
    }

    const [updatedMedia] = await this.db
      .update(media)
      .set({
        mimeType: data.mimeType,
        originalName: data.originalName,
        variants: data.variants,
      })
      .where(eq(media.id, id))
      .returning();

    if (!updatedMedia) {
      throw new Error("unable to update media in database");
    }

    return updatedMedia;
  };
}
