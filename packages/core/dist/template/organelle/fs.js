"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs = void 0;
var define_organelle_module_create_1 = require("../../organelle/define-organelle-module-create");
var fs = {
    v1: define_organelle_module_create_1.domc(["WriteFile", "ReadFile"], ["ACK", "Log", "Exception", "FileContent"])
};
exports.fs = fs;
//# sourceMappingURL=fs.js.map