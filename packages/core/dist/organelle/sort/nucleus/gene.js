"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cc = exports.createChromosome = void 0;
var particle_1 = require("../../../particle");
exports.createChromosome = function (bind) {
    var geneCluster = [];
    bind(function (name, triggers, reaction, adds) {
        var meta = adds && adds.expireAt ? particle_1.createMeta("Gene", { expireAt: adds.expireAt }) : particle_1.createMeta("Gene");
        var data = { name: name, triggers: triggers, reaction: reaction, override: adds === null || adds === void 0 ? void 0 : adds.override };
        geneCluster.push({ meta: meta, data: data });
    });
    return geneCluster;
};
/**
 * createChromosome
 */
exports.cc = exports.createChromosome;
//# sourceMappingURL=gene.js.map