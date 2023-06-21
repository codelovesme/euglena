"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cessnalib_1 = require("cessnalib");
var organelle_timer_js_1 = __importDefault(require("@euglena/organelle.timer.js"));
var constants_1 = require("../constants");
var core_1 = require("@euglena/core");
var now = cessnalib_1.sys.StaticTools.Time.fromJavascriptDate(new Date());
exports.default = [
    (0, core_1.cp)("OrganelleInfo", {
        name: constants_1.organelles.timer,
        location: {
            type: "InMemory",
            organelle: organelle_timer_js_1.default
        }
    }),
    (0, core_1.cp)("Sap", now, { organelleName: constants_1.organelles.timer })
];
//# sourceMappingURL=timer.js.map