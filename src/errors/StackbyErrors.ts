import { AppError } from "./AppError";

export class StackbyFilterError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export class UnsupportedOperatorError extends StackbyFilterError {
  constructor(operator: string) {
    super(`Unsupported operator: ${operator}`, { operator });
  }
}

export class MissingValueError extends StackbyFilterError {
  constructor(operator: string) {
    super(`Missing value for operator: ${operator}`, { operator });
  }
}

export class MissingColumnError extends StackbyFilterError {
  constructor(operator: string) {
    super(`Missing column for operator: ${operator}`, { operator });
  }
}
