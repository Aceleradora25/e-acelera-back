var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsOptional, IsString } from "class-validator";
import { StackbyEndpoint } from "../types/types.js";
import { STACKBY_FILTER_OPERATORS } from "../utils/stackby-filter.js";
export class StackbyParamsDto {
    endpoint;
    operator;
    column;
    value;
}
__decorate([
    IsEnum(StackbyEndpoint, {
        message: "Endpoint must be one of: Exercises, Topics, Themes",
    }),
    __metadata("design:type", Object)
], StackbyParamsDto.prototype, "endpoint", void 0);
__decorate([
    IsOptional(),
    IsEnum(STACKBY_FILTER_OPERATORS),
    __metadata("design:type", String)
], StackbyParamsDto.prototype, "operator", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], StackbyParamsDto.prototype, "column", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], StackbyParamsDto.prototype, "value", void 0);
