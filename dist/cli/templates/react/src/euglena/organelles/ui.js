"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@euglena/core");
var organelle_ui_react_1 = __importDefault(require("@euglena/organelle.ui.react"));
var app_1 = __importDefault(require("../../components/app"));
var constants_1 = require("../constants");
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.ui,
        location: {
            type: "InMemory",
            organelle: organelle_ui_react_1.default
        }
    }),
    (0, core_1.cp)("Sap", { rootComponent: app_1.default, serviceWorker: false }, { organelleName: constants_1.organelles.ui })
];
//# sourceMappingURL=ui.js.map