"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
var organelle_1 = require("@euglena/organelle");
var common_1 = require("@euglena/common");
exports.default = organelle_1.domc("EndoplasmicReticulum", {
    incoming: {
        TransmitParticle: function (particle, target) { return particle_1.cp("TransmitParticle", { target: target, particle: particle }); },
        OrganelleInfo: function (name, location, nick) {
            return particle_1.cp("OrganelleInfo", {
                name: name,
                location: location,
                nick: nick
            });
        }
    },
    outgoing: {
        Log: common_1.ccp.Log,
        TransmitResponse: function (particle) { return particle_1.cp("TransmitResponse", particle); },
        EuglenaHasBeenBorn: function () { return particle_1.cp("EuglenaHasBeenBorn", undefined); }
    }
});
//# sourceMappingURL=index.js.map