export var STACKBY_FILTER_OPERATORS;
(function (STACKBY_FILTER_OPERATORS) {
    STACKBY_FILTER_OPERATORS["TO_CONTAINS"] = "toContains";
    STACKBY_FILTER_OPERATORS["DOES_NOT_CONTAIN"] = "doesNotContain";
    STACKBY_FILTER_OPERATORS["EQUAL"] = "equal";
    STACKBY_FILTER_OPERATORS["NOT_EQUAL"] = "notEqual";
    STACKBY_FILTER_OPERATORS["IS_EMPTY"] = "isEmpty";
    STACKBY_FILTER_OPERATORS["IS_NOT_EMPTY"] = "isNotEmpty";
    STACKBY_FILTER_OPERATORS["GREATER_THAN"] = "greaterThan";
    STACKBY_FILTER_OPERATORS["GREATER_THAN_EQUAL"] = "greaterThanEqual";
    STACKBY_FILTER_OPERATORS["LESS_THAN"] = "lessThan";
    STACKBY_FILTER_OPERATORS["LESS_THAN_EQUAL"] = "lessThanEqual";
    STACKBY_FILTER_OPERATORS["IS_EXACTLY"] = "isExactly";
    STACKBY_FILTER_OPERATORS["IS_ANY_OF"] = "isAnyOf";
    STACKBY_FILTER_OPERATORS["FILE_NAME"] = "fileName";
    STACKBY_FILTER_OPERATORS["FILE_TYPE"] = "fileType";
    STACKBY_FILTER_OPERATORS["BY_ID"] = "rowIds";
})(STACKBY_FILTER_OPERATORS || (STACKBY_FILTER_OPERATORS = {}));
export class StackbyFilter {
    operator;
    value;
    constructor(operator, value) {
        this.operator = operator;
        this.value = value;
    }
}
export class StackbyStandardFilter extends StackbyFilter {
    column;
    constructor(operator, column, value) {
        super(operator, value);
        this.column = column;
    }
    getStackbyFilterString() {
        return `filter=${this.operator}({${this.column}},${this.value})`;
    }
}
export class StackbyFilterById extends StackbyFilter {
    constructor(value) {
        super(STACKBY_FILTER_OPERATORS.BY_ID, value);
    }
    getStackbyFilterString() {
        return `${this.operator}[]=${this.value}`;
    }
}
