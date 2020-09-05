"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var define_organelle_module_create_1 = require("../define-organelle-module-create");
var webServer = {
    v1: define_organelle_module_create_1.domc(["GetAlive", "AddRoute"], ["ACK", "Exception", "WebServerImpulse", "Log"])
};
exports.webServer = webServer;
//# sourceMappingURL=web-server.js.map