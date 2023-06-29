"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_nucleus_js_1 = __importDefault(require("@euglena/organelle.nucleus.js"));
var genes_1 = __importDefault(require("../genes"));
var constants_1 = require("../constants");
var core_1 = require("@euglena/core");
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.nucleus,
        location: {
            type: "InMemory",
            organelle: organelle_nucleus_js_1.default,
        },
    }),
    (0, core_1.cp)("Sap", {
        type: "InMemory",
        genes: genes_1.default,
    }, { organelleName: constants_1.organelles.nucleus }),
];
//# sourceMappingURL=nucleus.js.map