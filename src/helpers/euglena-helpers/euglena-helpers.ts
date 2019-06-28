"use strict";
/**
 * Created by codelovesme on 6/19/2015.
 */
/*
 *TODO List
 *
 * #Generate impact for particle value change
 * #Seperate nucleus to a organelle
 * #Seperate particle, request, event
 *
 */
/**
 * Next major version api changes
 * class Cytoplasm {
 *      constructor(particles: AnyParticle[], organelles: Organelle<any>[], chromosome: dna.AnyGene[], euglenaName?: string) {
 * //Get the euglenaName from particles if it is not set
 *
 */
import vacuole, { VacuoleDefaultExport } from "./organelles/vacuole";
import timer, { TimerDefaultExport } from "./organelles/timer";
import logger, { LoggerDefaultExport } from "./organelles/logger";
import { sys, js } from "cessnalib";
import { OrganelleReceive, CreateOrganelle } from "../../organelle";
import { Particle } from "../../particle";
import { Chromosome, GeneReaction, GeneCluster } from "../../gene";
import { Transmit, CytoplasmReceive } from "../../cytoplasm";
import { createCommonParticle, commonParticles } from "../common-particles";

const [vacuoleOrganelleName, vacuoleCreateOrganelle]: VacuoleDefaultExport = vacuole;
const [timerOrganelleName, timerCreateOrganelle]: TimerDefaultExport = timer;
const [loggerOrganelleName, loggerCreateOrganelle, createLoggerParticle]: LoggerDefaultExport = logger;

export interface Cytoplasm {
  organelles: { [organelleName: string]: OrganelleReceive };
  chromosome: Chromosome;
}

let cytoplasm: Cytoplasm;

export function createEuglena(createOrganelles: { [organelleName: string]: CreateOrganelle }, geneCluster: GeneCluster, particles: Particle[]) {
  if (cytoplasm) {
    throw "There exists a cytoplasm instance already.";
  }
  let chromosome: Chromosome = [];
  let organelles: { [organelleName: string]: OrganelleReceive } = {};
  /**
   * define receive
   */
  const receive: CytoplasmReceive = (particle: Particle, sender: string): sys.type.Observable<Particle> => {
    organelles[loggerOrganelleName](createLoggerParticle("Log", `Receiving Particle ${JSON.stringify(particle.meta)}`));
    return new sys.type.Observable(publish => {
      //find which genes are matched with properties of the particle
      const triggerableReactions = new Array<{
        index: number;
        triggers: string[];
        reaction: GeneReaction;
      }>();
      for (let i = 0; i < chromosome.length; i++) {
        let triggers: any = chromosome[i].data.triggers;
        if (js.Class.doesMongoCover(particle, triggers)) {
          const reaction = chromosome[i].data.reaction;
          triggerableReactions.push({
            index: i,
            triggers: Object.keys(triggers),
            reaction: reaction
          });
        }
      }
      //get rid of overrided reactions
      const reactions = Array<GeneReaction>();
      const names = Array<string>();
      for (let tr of triggerableReactions) {
        let doTrigger = true;
        //Check if the tr is contained by others, if true
        for (let tr2 of triggerableReactions) {
          //if it is the same object, do nothing
          if (tr.index === tr2.index) continue;
          //then if triggers of tr2 does not contain triggers of tr, do nothing
          if (!sys.type.StaticTools.Array.containsArray(tr2.triggers, tr.triggers)) continue;
          //then check if tr2 overrides tr
          doTrigger = !(chromosome[tr2.index].data.override === chromosome[tr.index].data.name);
        }
        if (doTrigger) {
          reactions.push(tr.reaction);
          names.push(chromosome[tr.index].data.name);
        }
      }
      //trigger collected reactions
      for (let i = 0; i < reactions.length; i++) {
        let reaction: GeneReaction = reactions[i];
        const geneName: string = names[i];
        organelles[loggerOrganelleName](createLoggerParticle("Log", `Triggering Gene: ${geneName} Particle: ${JSON.stringify(particle.meta)}`));
        reaction(particle, sender, {
          receive: receive,
          transmit: transmit
        }).then((response: Particle) => {
          //response will be undefined after resolving of Promise<void>
          if (response) publish(response);
        });
      }
    });
  };

  /**
   * define transmit
   */
  const transmit: Transmit = (organelleName, particle) => {
    organelles[loggerOrganelleName](createLoggerParticle("Log", `Transmitting To ${organelleName} Particle: ${JSON.stringify(particle.meta)}`));
    const receive: OrganelleReceive = organelles[organelleName];
    if (!receive) {
      organelles[loggerOrganelleName](createLoggerParticle("Log", `${organelleName} receive function is not implemeted!`));
      throw "Not Implemented";
    }
    return receive(particle);
  };
  /**
   * fill chromosome
   */
  chromosome = [...chromosome, ...geneCluster];

  /**
   * create organelle logger
   */
  organelles[loggerOrganelleName] = loggerCreateOrganelle(receive);

  /**
   * create organelle vacuole
   */
  organelles[vacuoleOrganelleName] = vacuoleCreateOrganelle(receive);

  /**
   * create organelle timer
   */
  organelles[timerOrganelleName] = timerCreateOrganelle(receive);

  /**
   * generate Organelles
   */
  organelles = Object.keys(createOrganelles).reduce(
    (organelles, organelleName) => ((organelles[organelleName] = createOrganelles[organelleName](receive)), organelles),
    organelles
  );

  cytoplasm = {
    organelles,
    chromosome
  };

  receive(createCommonParticle(commonParticles.EuglenaHasBeenBorn), "cytoplasm");
}
