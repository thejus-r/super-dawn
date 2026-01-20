export class Image {
  constructor(
    public readonly id: string,
    public readonly filename: string,
    public readonly mimeType: string,
    public readonly size: number,
  ) {
    if (size > 10 * 1024 * 1024) {
      throw new Error("image too large");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(mimeType)) {
      throw new Error("invalid mimetype");
    }
  }
}
