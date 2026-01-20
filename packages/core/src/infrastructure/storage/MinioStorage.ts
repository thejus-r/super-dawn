import type { IStorageService } from "../../domain/services/IStorageService";
import { Client } from "minio";

export class MinioStorage implements IStorageService {
  private client: Client;
  private readonly bucket = "images";

  constructor() {
    this.client = new Client({
      endPoint: "localhost",
      port: 9000,
      useSSL: false,
      accessKey: "admin",
      secretKey: "password",
    });
  }
  initialize = async (): Promise<void> => {
    const exists = await this.client.bucketExists(this.bucket);

    if (!exists) {
      await this.client.makeBucket(this.bucket, "superdawn");
      console.log(`🪣 Bucket '${this.bucket}' created.`);
    }
  };
  upload = async (key: string, file: Buffer, mimeType: string) => {
    await this.initialize();
    await this.client.putObject("images", key, file, file.length, {
      "Content-Type": mimeType,
    });

    return key;
  };

  download = async (key: string): Promise<Buffer> => {
    const dataStream = await this.client.getObject(this.bucket, key);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      dataStream.on("data", (chunk) => chunks.push(chunk));
      dataStream.on("end", () => resolve(Buffer.concat(chunks)));
      dataStream.on("error", (err) => reject(err));
    });
  };
}
