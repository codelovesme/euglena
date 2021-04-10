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
exports.cm = exports.cp = exports.isParticleClass = exports.isParticle = exports.assertNotParticle = exports.createParticle = exports.createMeta = void 0;
exports.createMeta = function (class_, adds) {
    return __assign({ class: class_ }, adds);
};
exports.createParticle = function (class_, data, adds) {
    return {
        meta: exports.createMeta(class_, adds),
        data: data
    };
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
exports.isParticleClass = function (particle, class_) {
    return particle.meta.class === class_;
};
/**
 * createParticle
 */
exports.cp = exports.createParticle;
/**
 * createMeta
 */
exports.cm = exports.createMeta;
//# sourceMappingURL=particle.js.map