"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.netClient = void 0;
var define_organelle_module_create_1 = require("../define-organelle-module-create");
var netClient = {
    v1: define_organelle_module_create_1.domc(["TransmitParticle"], ["Log", "ACK", "Exception"])
};
exports.netClient = netClient;
//# sourceMappingURL=net-client.js.map