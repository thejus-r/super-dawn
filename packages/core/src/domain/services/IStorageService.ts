
export type ObjectWithMetadata = {
  buffer: Buffer,
  mimeType: string
}
export interface IStorageService {
  initialize(): Promise<void>;
  upload(key: string, file: Buffer, mimeType: string): Promise<string>;
  download(key: string): Promise<ObjectWithMetadata>;
}
