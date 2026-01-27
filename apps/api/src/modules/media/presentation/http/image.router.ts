import { Elysia, t } from "elysia";
import type { ImageService } from "../../services/Image.service";

export const registerImageRoutes = (imageService: ImageService) => {
  return new Elysia({ prefix: "image" })
    .get("/*", async ({ params, set }) => {

      console.log("image req", params["*"])
      const { buffer, mimeType } = await imageService.getImage(params["*"]);
      set.headers["content-type"] = mimeType
      return buffer
    })
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const file = body.file;

          const result = imageService.uploadImage({
            file: Buffer.from(await file.arrayBuffer()),
            filename: file.name,
            mimeType: file.type,
          });

          return result;
        } catch (error) {
          set.status = 400;
          return {
            error: (error as Error).message,
          };
        }
      },
      {
        body: t.Object({
          file: t.File(),
        }),
      },
    );
};
