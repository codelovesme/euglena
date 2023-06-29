"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@euglena/core");
var organelle_logger_console_1 = __importDefault(require("@euglena/organelle.logger.console"));
var constants_1 = require("../constants");
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.logger,
        location: {
            type: "InMemory",
            organelle: organelle_logger_console_1.default
        }
    })
];
//# sourceMappingURL=logger.js.map