"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netServer = void 0;
var define_organelle_module_create_1 = require("../../organelle/define-organelle-module-create");
var netServer = {
    v1: define_organelle_module_create_1.domc(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};
exports.netServer = netServer;
//# sourceMappingURL=net-server.js.map