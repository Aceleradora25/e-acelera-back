import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 403, details);
  }
}
