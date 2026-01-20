export interface IStorageService {
  initialize(): Promise<void>;
  upload(key: string, file: Buffer, mimeType: string): Promise<string>;
  download(key: string): Promise<Buffer>;
}
