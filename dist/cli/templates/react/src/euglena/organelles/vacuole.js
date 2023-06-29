"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@euglena/core");
var organelle_vacuole_js_1 = __importDefault(require("@euglena/organelle.vacuole.js"));
var particles_1 = __importDefault(require("../particles"));
var constants_1 = require("../constants");
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.vacuoleJs,
        location: {
            type: "InMemory",
            organelle: organelle_vacuole_js_1.default
        }
    }),
    (0, core_1.cp)("Sap", {
        type: "InMemory",
        particles: particles_1.default
    })
];
//# sourceMappingURL=vacuole.js.map