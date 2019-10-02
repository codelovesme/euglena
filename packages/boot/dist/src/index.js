"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_endoplasmic_reticulum_js_1 = __importDefault(require("@euglena/organelle.endoplasmic-reticulum.js"));
exports.createEuglena = function (createSap) {
    var reticulumReceive = organelle_endoplasmic_reticulum_js_1.default.createOrganelle();
    var reticulumSap = createSap(reticulumReceive);
    reticulumReceive(reticulumSap);
};
/**
 * Alias for createEuglena
 */
exports.ce = exports.createEuglena;
//# sourceMappingURL=index.js.map