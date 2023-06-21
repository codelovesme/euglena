#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var template_1 = require("@euglena/template");
var euglena_1 = __importDefault(require("../euglena"));
template_1.cell.ce(euglena_1.default).catch(function (err) {
    console.error("Error - ".concat(err.data.message));
});
//# sourceMappingURL=index.js.map