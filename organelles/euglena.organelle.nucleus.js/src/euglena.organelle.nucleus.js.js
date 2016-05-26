"use strict";
var euglena_template_1 = require("../node_modules/euglena/euglena_template/src/euglena_template");
var euglena_1 = require("../node_modules/euglena/euglena/src/euglena");
var path = require("path");
var Euglena = euglena_1.euglena.being.alive.Body;
var sys = euglena_1.euglena.sys;
class Organelle extends euglena_template_1.euglena_template.being.alive.organelles.Nucleus {
    constructor() {
        super("NucleusOrganelleImplJs");
        this.loadGenes();
    }
    receive(particle, response) {
        for (var i = 0; i < this.chromosome.length; i++) {
            if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.name)) {
                var reaction = this.chromosome[i].reaction;
                console.log("triggering gene " + this.chromosome[i].name);
                reaction(particle, Euglena.instance, response);
            }
        }
    }
    loadGenes() {
        let appDir = path.dirname(require.main.filename);
        let chromosomeFile = path.join(appDir, '../', 'genes/instinct');
        let module = require(chromosomeFile);
        this.chromosome = module.chromosome;
    }
}
exports.Organelle = Organelle;
//# sourceMappingURL=euglena.organelle.nucleus.js.js.map