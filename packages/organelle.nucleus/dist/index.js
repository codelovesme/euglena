"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports.default = organelle_1.domc("Nucleus", {
    incoming: {
        ReceiveParticle: function (particle, source) { return particle_1.cp("ReceiveParticle", { particle: particle, source: source }); }
    },
    outgoing: {
        Log: common_1.ccp.Log,
        Exception: common_1.ccp.Exception,
        ACK: common_1.ccp.ACK
    }
});
//# sourceMappingURL=index.js.map