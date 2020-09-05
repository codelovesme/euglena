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
exports.createMeta = function (_class, adds) {
    return (__assign({ class: _class, createdAt: new Date().getTime() }, adds));
};
exports.createParticle = function (_class, data, adds) {
    return { meta: exports.createMeta(_class, adds), data: data };
};
function assertNotParticle(particle, message) {
    throw message || "Assertion fails: " + particle + " is a particle where it shouldn't be";
}
exports.assertNotParticle = assertNotParticle;
function isParticle(x) {
    return (typeof x === "object" && typeof x.meta === "object" && typeof x.meta.class === "string"
    // typeof x.meta.createdAt === "number" &&
    // "data" in x
    );
}
exports.isParticle = isParticle;
/**
 * createParticle
 */
exports.cp = exports.createParticle;
/**
 * createMeta
 */
exports.cm = exports.createMeta;
//# sourceMappingURL=particle.js.map