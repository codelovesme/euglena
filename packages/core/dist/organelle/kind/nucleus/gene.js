"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = require("../../../particle");
exports.createChromosome = function (bind) {
    var geneCluster = [];
    bind(function (name, triggers, reaction, adds) {
        var _a;
        var meta = adds && adds.expireAt ? particle_1.createMeta("Gene", { expireAt: adds.expireAt }) : particle_1.createMeta("Gene");
        var data = { name: name, triggers: triggers, reaction: reaction, override: (_a = adds) === null || _a === void 0 ? void 0 : _a.override };
        geneCluster.push({ meta: meta, data: data });
    });
    return geneCluster;
};
/**
 * Alias for createChromosome
 */
exports.cc = exports.createChromosome;
//# sourceMappingURL=gene.js.map