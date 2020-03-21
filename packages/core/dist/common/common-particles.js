"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("../particle");
var defineCommonParticles = function (particleNames) {
    return particleNames.reduce(function (acc, curr) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[curr] = particle_1.cp.bind(undefined, curr), _a)));
    }, {});
};
exports.createCommonParticles = defineCommonParticles([
    "ACK",
    "EuglenaName",
    "Exception",
    "InvalidParticle",
    "Log",
    "Metas",
    "NoReaction",
    "Particles",
    "GetAlive",
    "Hibernate",
    "EuglenaInfo",
    "ReadParticle",
    "SaveParticle",
    "RemoveParticle",
    "Impulse"
]);
/**
 * Alias for createCommonParticle
 */
exports.ccp = exports.createCommonParticles;
//# sourceMappingURL=common-particles.js.map