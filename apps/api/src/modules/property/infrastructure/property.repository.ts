import type { Database } from "@/db";
import { properties } from "@/db/schema/property";
import type {
  IPropertyRepository,
  NewProperty,
} from "../domain/entity/property.entity";

export class PropertyRepository implements IPropertyRepository {
  constructor(private readonly db: Database) {}

  create = async (payload: NewProperty) => {
    const [newProperty] = await this.db
      .insert(properties)
      .values(payload)
      .returning();

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
    });

    return res;
  };

  update = async (payload: NewProperty) => {
    const [updatedProperty] = await this.db
      .update(properties)
      .set({
        ...payload,
      })
      .returning();

    if (!updatedProperty) {
      throw new Error("unable to update property");
    }
    return updatedProperty;
  };
}
