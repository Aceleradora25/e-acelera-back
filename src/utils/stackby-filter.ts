export type FilterValue = string | number;

export enum STACKBY_FILTER_OPERATORS {
  TO_CONTAINS = 'toContains',
  DOES_NOT_CONTAIN = 'doesNotContain',
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_EQUAL = 'greaterThanEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_EQUAL = 'lessThanEqual',
  IS_EXACTLY = 'isExactly',
  IS_ANY_OF = 'isAnyOf',
  FILE_NAME = 'fileName',
  FILE_TYPE = 'fileType',
  BY_ID = 'rowIds',
}

export abstract class StackbyFilter {
  constructor(
    public operator: STACKBY_FILTER_OPERATORS,
    public value?: FilterValue
  ) {}

  abstract getStackbyFilterString(): string;
}

export class StackbyStandardFilter extends StackbyFilter {
  constructor(
    operator: Exclude<STACKBY_FILTER_OPERATORS, STACKBY_FILTER_OPERATORS.BY_ID>,
    public column: string,
    value?: FilterValue
  ) {
    super(operator, value);
  }

  getStackbyFilterString(): string {
    return `filter=${this.operator}({${this.column}},${this.value})`;
  }
}

export class StackbyFilterById extends StackbyFilter {
  constructor(value: string) {
    super(STACKBY_FILTER_OPERATORS.BY_ID, value);
  }

  getStackbyFilterString(): string {
    return `${this.operator}[]=${this.value}`;
  }
}
