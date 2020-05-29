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
var create_organelle_module_1 = require("./create-organelle-module");
var defineOrganelleModuleCreate = function (incomingParticleNames, outgoingParticleNames, organelleName) {
    var _a;
    var createParticles = {
        incoming: incomingParticleNames.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr] = particle_1.cp.bind(undefined, curr), _a)));
        }, (_a = {}, _a["Sap"] = particle_1.cp.bind(undefined, "Sap"), _a)),
        outgoing: outgoingParticleNames.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr] = particle_1.cp.bind(undefined, curr), _a)));
        }, {})
    };
    return {
        com: organelleName
            ? function (bindReactions) {
                return create_organelle_module_1.com(createParticles, bindReactions, organelleName);
            }
            : function (bindReactions) {
                return create_organelle_module_1.com(createParticles, bindReactions);
            },
        cp: createParticles
    };
};
/**
 * defineOrganelleModuleCreate
 */
exports.domc = defineOrganelleModuleCreate;
//# sourceMappingURL=define-organelle-module-create.js.map