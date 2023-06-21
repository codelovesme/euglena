"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstParticle = exports.getParticle = void 0;
var core_1 = require("@euglena/core");
var getParticle = function (particles, particleName) {
    return particles.data.find(function (x) { return (0, core_1.isParticleClass)(x, particleName); });
};
exports.getParticle = getParticle;
var getFirstParticle = function (particles) {
    return particles.data[0];
};
exports.getFirstParticle = getFirstParticle;
//# sourceMappingURL=particles.par.u.js.map