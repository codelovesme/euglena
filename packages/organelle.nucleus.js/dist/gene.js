"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("@euglena/particle");
exports.createChromosome = function (bind) {
    var geneCluster = [];
    bind(function (name, triggers, reaction, adds) {
        var meta = adds && adds.expireTime ? particle_1.createMeta("Gene", { expireTime: adds.expireTime }) : particle_1.createMeta("Gene");
        var data = adds && adds.override
            ? { name: name, triggers: triggers, reaction: reaction, override: adds.override }
            : { name: name, triggers: triggers, reaction: reaction };
        geneCluster.push({ meta: meta, data: data });
    });
    return geneCluster;
};
/**
 * Alias for createChromosome
 */
exports.cc = exports.createChromosome;
//# sourceMappingURL=gene.js.map