import { AppError } from "./AppError.js";
export class StackbyFilterError extends AppError {
    constructor(message, details) {
        super(message, 400, details);
    }
}
export class UnsupportedOperatorError extends StackbyFilterError {
    constructor(operator) {
        super(`Unsupported operator: ${operator}`, { operator });
    }
}
export class MissingValueError extends StackbyFilterError {
    constructor(operator) {
        super(`Missing value for operator: ${operator}`, { operator });
    }
}
export class MissingColumnError extends StackbyFilterError {
    constructor(operator) {
        super(`Missing column for operator: ${operator}`, { operator });
    }
}
