"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
var netServer = {
    v1: organelle_1.domc(["GetAlive"], ["ACK", "Exception", "Impulse", "Log"])
};
exports.netServer = netServer;
//# sourceMappingURL=net-server.js.map