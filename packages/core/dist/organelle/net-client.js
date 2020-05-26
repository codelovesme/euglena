"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var organelle_1 = require("./organelle");
var netClient = {
    v1: organelle_1.domc(["TransmitParticle"], ["Log", "ACK", "Exception"])
};
exports.netClient = netClient;
//# sourceMappingURL=net-client.js.map