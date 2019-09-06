"use strict";
/**
 * Created by codelovesme on 6/19/2015.
 */
/*
 *TODO List
 *
 * #Seperate nucleus to a organelle ?
 * (This is not necessary - brings complexity Agust3/2019)
 *
 */
import { CreateOrganelle, OrganelleReceive } from "./organelle.h";
import { Particle } from "./particle.h";
import { CreateEuglena } from "./euglena.h";
import { GeneReaction, Chromosome } from "./gene.h";
import { Transmit, CytoplasmReceive, Cytoplasm } from "./cytoplasm.h";

import { sys, js } from "cessnalib";
import { ccp } from "../template/common-particles";
import { timer } from "../template/organelles/timer";
import { logger } from "../template/organelles/logger";
import { vacuole } from "../template/organelles/vacuole";

let cytoplasm: Cytoplasm;

export const createEuglena: CreateEuglena = (
  createOrganelles: { [organelleName: string]: CreateOrganelle },
  geneCluster: Chromosome
) => {
  if (cytoplasm) {
    throw "There exists a cytoplasm instance already.";
  }
  let genes: Chromosome = [];
  let organelles: { [organelleName: string]: OrganelleReceive } = {};
  /**
   * define transmit
   */
  const transmit: Transmit = (organelleName: string, particle: Particle): Promise<Particle | void> => {
    organelles[logger.n](
      logger.cp.incoming.LoggerLog(
        `Transmitting To ${organelleName} Particle: ${JSON.stringify(particle.meta)}`,
        "Info"
      )
    );
    const organelleReceive: OrganelleReceive = organelles[organelleName];
    if (!organelleReceive) {
      organelles[logger.n](
        logger.cp.incoming.LoggerLog(`${organelleName} receive function is not implemeted!`, "Info")
      );
      throw "Not Implemented";
    }
    return organelleReceive(particle);
  };
  /**
   * define receive
   */
  const receive: CytoplasmReceive = (sender: string, particle: Particle) => {
    organelles[logger.n](
      logger.cp.incoming.LoggerLog(`Receiving from ${sender} Particle ${JSON.stringify(particle)}`, "Info")
    );
    organelles[logger.n](
      logger.cp.incoming.LoggerLog(`Receiving from ${sender} Particle ${JSON.stringify(particle.meta)}`, "Info")
    );
    //find which genes are matched with properties of the particle
    const triggerableReactions = new Array<{
      index: number;
      triggers: string[];
      reaction: GeneReaction;
    }>();
    for (let i = 0; i < genes.length; i++) {
      let triggers: any = genes[i].data.triggers;
      if (js.Class.doesMongoCover(particle, triggers)) {
        const reaction = genes[i].data.reaction;
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
        doTrigger = !(genes[tr2.index].data.override === genes[tr.index].data.name);
      }
      if (doTrigger) {
        reactions.push(tr.reaction);
        names.push(genes[tr.index].data.name);
      }
    }
    //trigger collected reactions
    for (let i = 0; i < reactions.length; i++) {
      let reaction: GeneReaction = reactions[i];
      const geneName: string = names[i];
      organelles[logger.n](
        logger.cp.incoming.LoggerLog(`Triggering Gene: ${geneName} Particle: ${JSON.stringify(particle.meta)}`, "Info")
      );
      reaction(particle, sender, {
        receive: receive,
        r: receive,
        transmit: transmit,
        t: transmit
      });
    }
  };
  /**
   * fill chromosome
   */
  genes = [...genes, ...geneCluster];

  /**
   * create organelle logger
   */
  organelles[logger.n] = logger.co(receive);

  /**
   * create organelle vacuole
   */
  organelles[vacuole.n] = vacuole.co(receive);

  /**
   * create organelle timer
   */
  organelles[timer.n] = timer.co(receive);

  /**
   * generate Organelles
   */
  organelles = Object.keys(createOrganelles).reduce(
    (organelles, organelleName) => ((organelles[organelleName] = createOrganelles[organelleName](receive)), organelles),
    organelles
  );

  cytoplasm = {
    organelles,
    chromosome: genes
  };

  receive("cytoplasm", ccp.EuglenaHasBeenBorn());
};

/**
 * Alias for createEuglena
 */
export const ce = createEuglena;
