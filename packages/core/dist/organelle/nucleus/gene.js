"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
exports.createChromosome = function (bind) {
    var geneCluster = [];
    bind(function (name, triggers, reaction, adds) {
        var meta = adds && adds.expireAt ? __1.createMeta("Gene", { expireAt: adds.expireAt }) : __1.createMeta("Gene");
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