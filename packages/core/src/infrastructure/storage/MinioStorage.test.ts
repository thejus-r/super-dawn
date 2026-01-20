import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { MinioStorage } from "./MinioStorage.ts";

type MinioMockTypes = {
  putObject: Mock;
  bucketExists: Mock;
  makeBucket: Mock;
  getObject: Mock;
};

const mocks = vi.hoisted<MinioMockTypes>(() => ({
  putObject: vi.fn(),
  bucketExists: vi.fn(),
  makeBucket: vi.fn(),
  getObject: vi.fn(),
}));

vi.mock("minio", () => {
  return {
    Client: class {
      putObject = mocks.putObject;
      bucketExists = mocks.bucketExists;
      makeBucket = mocks.makeBucket;
      getObject = mocks.getObject;
    },
  };
});

describe("[Infrastructure]: MinioStorage", () => {
  let storage: MinioStorage;

  beforeEach(() => {
    vi.clearAllMocks();
    storage = new MinioStorage();
  });

  it("should upload file to existing bucket", async () => {
    mocks.bucketExists.mockResolvedValue(true);
    mocks.putObject.mockResolvedValue("etag-123");

    const buffer = Buffer.from("fake-image");
    await storage.upload("test.jpg", buffer, "image/jpeg");

    // verify: makeBucket was NOT called
    expect(mocks.makeBucket).not.toHaveBeenCalled();

    // verify: putObject was called with correct params
    expect(mocks.putObject).toHaveBeenCalledWith(
      "images",
      "test.jpg",
      buffer,
      buffer.length,
      { "Content-Type": "image/jpeg" },
    );
  });

  it("should create bucket if it does not exists", async () => {
    mocks.bucketExists.mockResolvedValue(false);

    const buffer = Buffer.from("fake-image");
    await storage.upload("test.jpg", buffer, "image/jpeg");

    // verify: makeBucket was called
    expect(mocks.makeBucket).toHaveBeenCalledWith("images", "superdawn");
  });
});
