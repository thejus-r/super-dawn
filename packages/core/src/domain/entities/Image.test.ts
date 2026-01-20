import { describe, it, expect } from "vitest";
import { Image } from "./Image.ts";

describe("Domain Entity: Image", () => {
  it("should create a valid image entity", () => {
    const img = new Image("123", "test.jpg", "image/jpeg", 5000);
    expect(img.id).toBe("123");
    expect(img.mimeType).toBe("image/jpeg");
  });

  it("should throw error if the image is too large (>10MB)", () => {
    const largetSize = 11 * 1024 * 1024;

    expect(() => {
      new Image("123", "large.jpg", "image/png", largetSize);
    }).toThrowError("image too large");
  });

  it("should throw error for unsupported mime types", () => {
    expect(() => {
      new Image("123", "large.jpg", "application/x-msdownload", 1000);
    }).toThrowError("invalid mimetype");
  });
});
