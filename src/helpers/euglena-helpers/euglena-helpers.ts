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
import { sys, js } from "cessnalib";
import { OrganelleReceive, CreateOrganelle } from "../../organelle";
import { Particle } from "../../particle";
import { CreateGeneCluster, Chromosome } from "../../gene";
import { Reaction, Transmit } from "../../cytoplasm";
import { createCommonParticle, commonParticles } from "../particle-helpers";

const [vacuoleOrganelleName, vacuoleCreateOrganelle, vacuoleCrateParticle, vacuoleParticles]: VacuoleDefaultExport = vacuole;
const [timerOrganelleName, timerCreateOrganelle, timerCrateParticle, timerParticles]: TimerDefaultExport = timer;

export interface Cytoplasm {
  organelles: { [organelleName: string]: OrganelleReceive };
  chromosome: Chromosome;
}

let cytoplasm: Cytoplasm;

export function createEuglena(
  createOrganelles: { [organelleName: string]: CreateOrganelle },
  createGeneClusterArr: CreateGeneCluster[] | CreateGeneCluster,
  particles: Particle[]
) {
  if (cytoplasm) {
    throw "There exists a cytoplasm instance already.";
  }
  let chromosome: Chromosome = [];
  /**
   * define receive
   */
  const receive = (particle: Particle): sys.type.Observable<Particle> => {
    return new sys.type.Observable(publish => {
      console.log("inside observable");
      //find which genes are matched with properties of the particle
      let triggerableReactions = new Array<{
        index: number;
        triggers: string[];
        reaction: Reaction;
      }>();
      for (var i = 0; i < chromosome.length; i++) {
        let triggers: any = chromosome[i].data.triggers;
        if (js.Class.doesMongoCover(particle, triggers)) {
          var reaction = chromosome[i].data.reaction;
          triggerableReactions.push({
            index: i,
            triggers: Object.keys(triggers),
            reaction: reaction
          });
        }
      }
      //get rid of overrided reactions
      let reactions = Array<Reaction>();
      let names = Array<string>();
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
        let reaction = reactions[i];
        console.log("triggering gene");
        //@ts-ignore
        reaction(particle).then(response => {
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
    console.log("transmitting");
    const receive: OrganelleReceive = organelles[organelleName];
    if (!receive) throw "Not Implemented";
    return receive(particle);
  };
  /**
   * fill chromosome
   */
  createGeneClusterArr = createGeneClusterArr instanceof Array ? createGeneClusterArr : [createGeneClusterArr];
  for (const createGeneCluster of createGeneClusterArr) {
    chromosome = [...chromosome, ...createGeneCluster(transmit, receive)];
  }

  let organelles: { [organelleName: string]: OrganelleReceive } = {};

  /**
   * create organelle vacuole
   */
  const vocuoleReceive: OrganelleReceive = vacuoleCreateOrganelle(receive);
  organelles[vacuoleOrganelleName] = vocuoleReceive;

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
  //throw a particle tells the euglena has been born
  console.log("throwing particle EuglenaHasBeenborn");
  receive(createCommonParticle(commonParticles.EuglenaHasBeenBorn, "cytoplasm"));
}
