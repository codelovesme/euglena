"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var cessnalib_1 = require("cessnalib");
exports.createCommonParticle = {
    ACK: function (adds) { return particle_1.cp("ACK", undefined, adds); },
    EuglenaName: function (name, adds) { return particle_1.cp("EuglenaName", name, adds); },
    Exception: function (message, innerException, adds) {
        return particle_1.cp("Exception", new cessnalib_1.sys.type.Exception(message, innerException), adds);
    },
    Particles: function (particlesArray, adds) { return particle_1.cp("Particles", particlesArray, adds); },
    Metas: function (metas, adds) { return particle_1.cp("Metas", metas, adds); },
    NoReaction: function (adds) { return particle_1.cp("NoReaction", undefined, adds); },
    InvalidParticle: function (adds) { return particle_1.cp("InvalidParticle", adds); },
    Log: function (message, level, adds) {
        return particle_1.cp("Log", { message: message, level: level }, adds);
    },
    Sap: function (organelle, data) { return particle_1.cp("Sap", data, { organelle: organelle }); }
};
/**
 * Alias for createCommonParticle
 */
exports.ccp = exports.createCommonParticle;
global;
//# sourceMappingURL=index.js.map