"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webServer = void 0;
var define_organelle_module_create_1 = require("../define-organelle-module-create");
var webServer = {
    v1: define_organelle_module_create_1.domc(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};
exports.webServer = webServer;
//# sourceMappingURL=web-server.js.map