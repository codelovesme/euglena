"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var define_organelle_module_create_1 = require("../define-organelle-module-create");
var netServer = {
    v1: define_organelle_module_create_1.domc(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};
exports.netServer = netServer;
//# sourceMappingURL=net-server.js.map