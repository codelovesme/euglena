"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var print_hello_world_1 = __importDefault(require("./print-hello-world"));
var template_1 = require("@euglena/template");
var constants_1 = require("../constants");
exports.default = [(0, print_hello_world_1.default)(constants_1.organelles), template_1.sys.log.createGeneLog(constants_1.organelles)];
//# sourceMappingURL=index.js.map