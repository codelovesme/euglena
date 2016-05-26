"use strict";
import {euglena_template} from "../node_modules/euglena/euglena_template/src/euglena_template";
import {euglena} from "../node_modules/euglena/euglena/src/euglena";
import * as path from "path";
import * as fs from "fs";
import interaction = euglena.being.interaction;
import Particle = euglena.being.Particle;
import ParticleReference = euglena.being.alive.dna.ParticleReference;
import Euglena = euglena.being.alive.Body;
import sys = euglena.sys;
import Gene = euglena.being.alive.dna.Gene;

export class Organelle extends euglena_template.being.alive.organelles.Nucleus {
    private time: euglena.sys.type.Time;
    private chromosome:Gene[];
    constructor(){
        super("NucleusOrganelleImplJs");
        this.loadGenes();
    }
    public receive(particle: Particle, response: interaction.Response) {
        for (var i = 0; i < this.chromosome.length; i++) {
            if (sys.type.StaticTools.Array.contains(this.chromosome[i].triggers, particle.name)) {
                var reaction = this.chromosome[i].reaction;
                console.log("triggering gene " + this.chromosome[i].name);
                reaction(particle, Euglena.instance,response);
            }
        }
    }
    private loadGenes():void {
         let appDir = path.dirname(require.main.filename);
        let chromosomeFile = path.join(appDir,'../', 'genes/instinct');
        let module = require(chromosomeFile);
        this.chromosome = module.chromosome;
    }
}