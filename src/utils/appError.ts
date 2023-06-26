class AppError extends Error {
  public status: string;
  public code: number | null;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.code = null;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError }
