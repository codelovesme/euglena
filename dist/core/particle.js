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
var uuid_1 = require("uuid");
exports.createMeta = function (name, adds) { return (__assign({ id: uuid_1.v4(), name: name, createTime: new Date().getTime() }, adds)); };
exports.createParticle = function (name, data, adds) {
    return { meta: exports.createMeta(name, adds), data: data };
};
function assertNotParticle(particle, message) {
    throw message || "Assertion fails: " + particle + " is a particle where it shouldn't be";
}
exports.assertNotParticle = assertNotParticle;
/**
 * Alias for createParticle
 */
exports.cp = exports.createParticle;
/**
 * Alias for createMeta
 */
exports.cm = exports.createMeta;
//# sourceMappingURL=particle.js.map