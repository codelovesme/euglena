"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dcg = exports.cc = exports.cg = exports.createTriggerByClass = exports.defineCreateGene = exports.createChromosome = exports.createGene = void 0;
var core_1 = require("@euglena/core");
var createGene = function (name, triggers, reaction, organelles, override) {
    return (0, core_1.cp)("Gene", {
        name: name,
        triggers: triggers,
        reaction: reaction,
        organelles: organelles,
        override: override
    });
};
exports.createGene = createGene;
var createChromosome = function (bind) {
    var chromosome = [];
    bind(function (name, triggers, reaction, organelles, override) {
        chromosome.push((0, exports.createGene)(name, triggers, reaction, organelles, override));
    });
    return chromosome;
};
exports.createChromosome = createChromosome;
var defineCreateGene = function (name, triggers, reaction, override) { return function (organelles) {
    return (0, exports.createGene)(name, triggers, reaction, organelles, override);
}; };
exports.defineCreateGene = defineCreateGene;
var createTriggerByClass = function (particleClass) { return ({ meta: { class: particleClass } }); };
exports.createTriggerByClass = createTriggerByClass;
exports.cg = exports.createGene;
exports.cc = exports.createChromosome;
exports.dcg = exports.defineCreateGene;
//# sourceMappingURL=gene.u.js.map