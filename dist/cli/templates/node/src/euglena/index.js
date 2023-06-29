"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var organelles_1 = require("./organelles");
exports.default = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], organelles_1.reticulum, true), organelles_1.logger, true), organelles_1.nucleus, true), organelles_1.vacuole, true);
//# sourceMappingURL=index.js.map