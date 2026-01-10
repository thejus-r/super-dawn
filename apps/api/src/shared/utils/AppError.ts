export class AppError<C extends string> extends Error {
  override message: string;
  statusCode: number;
  code?: C | undefined;

  constructor({
    message,
    statusCode,
    code,
  }: {
    message: string;
    statusCode: number;
    code?: C;
  }) {
    super();
    ((this.message = message),
      (this.statusCode = statusCode),
      (this.code = code));
  }

  toResponse() {
    return Response.json(
      {
        success: false,
        message: this.message,
        code: this.code,
      },
      {
        status: this.statusCode,
      },
    );
  }
}
