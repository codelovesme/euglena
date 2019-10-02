"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports.default = organelle_1.domc("Vacuole", {
    incoming: {
        SaveParticle: function (particle, query, count, adds) {
            if (count === void 0) { count = 1; }
            return particle_1.cp("SaveParticle", { particle: particle, query: query, count: count }, adds);
        },
        ReadParticle: function (query, count, adds) {
            if (count === void 0) { count = 1; }
            return particle_1.cp("ReadParticle", { query: query, count: count }, adds);
        },
        RemoveParticle: function (query, count, adds) {
            if (count === void 0) { count = 1; }
            return particle_1.cp("RemoveParticle", { query: query, count: count }, adds);
        }
    },
    outgoing: {
        ACK: common_1.ccp.ACK,
        Exception: common_1.ccp.Exception,
        Particles: common_1.ccp.Particles,
        Metas: common_1.ccp.Metas
    }
});
//# sourceMappingURL=index.js.map