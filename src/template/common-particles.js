"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cessnalib_1 = require("cessnalib");
var particle_1 = require("../core/particle");
exports.createCommonParticle = {
    ACK: function (adds) { return particle_1.cp("ACK", undefined, adds); },
    EuglenaHasBeenBorn: function (adds) { return particle_1.cp("EuglenaHasBeenBorn", undefined, adds); },
    EuglenaName: function (name, adds) { return particle_1.cp("EuglenaName", name, adds); },
    Exception: function (message, innerException, adds) {
        return particle_1.cp("Exception", new cessnalib_1.sys.type.Exception(message, innerException), adds);
    },
    Particles: function (particlesArray, adds) { return particle_1.cp("Particles", particlesArray, adds); },
    Metas: function (metas, adds) { return particle_1.cp("Metas", metas, adds); },
    NoReaction: function (adds) { return particle_1.cp("NoReaction", undefined, adds); },
    OrganelleInfo: function (organelleName, location, adds) { return particle_1.cp("OrganelleInfo", { name: organelleName, location: location }, adds); },
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
    },
    InvalidParticle: function (adds) { return particle_1.cp("InvalidParticle", adds); }
};
/**
 * Alias for createCommonParticle
 */
exports.ccp = exports.createCommonParticle;
//# sourceMappingURL=common-particles.js.map