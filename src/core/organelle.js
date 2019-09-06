"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cessnalib_1 = require("cessnalib");
exports.createOrganelleModule = function (name, createParticles, bindReactions) {
    var createOrganelle = function (receive) {
        var reactions = new cessnalib_1.sys.type.Map();
        bindReactions(function (particleName, action) {
            reactions.add(particleName, action);
        });
        return function (particle) {
            var reaction = reactions.get(particle.meta.name);
            if (reaction) {
                var r = receive.bind(undefined, name);
                return reaction(particle, {
                    receive: r,
                    r: r,
                    createParticle: createParticles["outgoing"],
                    cp: createParticles["outgoing"]
                });
            }
            else {
                throw "There is no reaction of " + name + " for given particle " + JSON.stringify(particle.meta);
            }
        };
    };
    return {
        name: name,
        /**
         * Alias for name
         */
        n: name,
        createParticles: createParticles,
        /**
         * Alias for createParticles
         */
        cp: createParticles,
        createOrganelle: createOrganelle,
        /**
         * Alias for createOrganelle
         */
        co: createOrganelle
    };
};
/**
 * Alias for createOranelleModule
 */
exports.com = exports.createOrganelleModule;
//# sourceMappingURL=organelle.js.map