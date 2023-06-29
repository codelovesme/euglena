"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_ui_angular_1 = __importDefault(require("@euglena/organelle.ui.angular"));
var context_1 = require("../../app/context");
var constants_1 = require("../constants");
var core_1 = require("@euglena/core");
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.ui,
        location: {
            type: "InMemory",
            organelle: organelle_ui_angular_1.default
        }
    }),
    (0, core_1.cp)("Sap", {
        context: context_1.context
    }, { organelleName: constants_1.organelles.ui })
];
//# sourceMappingURL=ui.js.map