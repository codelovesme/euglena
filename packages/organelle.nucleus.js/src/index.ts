import { js, sys } from "cessnalib";
import { Gene, GeneReaction, Organelles, Stringify } from "./gene.h";
import * as core from "@euglena/core";
import { organelle, particle, transmit } from "@euglena/template";

import ACK = particle.common.ACK;
import common = particle.common;
import Exception = particle.common.Exception;
import nucleus = organelle.nucleus;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;
const cp = core.particle.cp;

let genes: Gene[] = [];

const receive = async (particle: Particle, source: string): Promise<Particle<string, unknown, {}>[]> => {
    console.log(`Info - Received particle ${particle.meta.class} inside the Nucleus`);

    //find which genes are matched with properties of the particle
    const triggerableReactions = new Array<{
        index: number;
        triggers: string[];
        reaction: GeneReaction;
        organelles: Stringify<Organelles>;
    }>();
    for (let i = 0; i < genes.length; i++) {
        let triggers: any = genes[i].data.triggers;
        if (js.Class.doesMongoCover(particle, triggers)) {
            const reaction = genes[i].data.reaction;
            triggerableReactions.push({
                index: i,
                triggers: Object.keys(triggers),
                reaction: reaction,
                organelles: genes[i].data.organelles
            });
        }
    }
    //get rid of overridden reactions
    const reactions = Array<[GeneReaction, Stringify<Organelles>]>();
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
            doTrigger = genes[tr2.index].data.override !== genes[tr.index].data.name;
        }
        if (doTrigger) {
            reactions.push([tr.reaction, tr.organelles]);
            names.push(genes[tr.index].data.name);
        }
    }
    //trigger collected reactions
    let promises: Promise<Particle | void>[] = [];
    for (let i = 0; i < reactions.length; i++) {
        let [reaction, organelles] = reactions[i];
        const geneName: string = names[i];
        console.log(`Info - Triggering Gene: ${geneName} Particle: ${JSON.stringify(particle.meta)}`);
        promises = [
            ...promises,
            reaction(particle, source, {
                t: async (particle: Particle, target: string) => (await transmit(particle, organelles[target])) as any,
                o: organelles
            })
        ];
    }
    const allResults = await Promise.all(promises);
    return allResults.filter((x) => x !== undefined) as Particle<string, unknown, {}>[];
};

type ExtendedParticles = Particle<
    common.Particles["meta"]["class"],
    common.Particles["data"],
    { cause: string }
>;

export type Sap = common.Sap<
    { path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { genes: Gene[]; type: "InMemory" }
>;

export default dco<nucleus.Nucleus, [Sap, ACK | Exception]>({
    ReceiveParticle: async (p) => {
        const { particle, source } = p.data;
        const result = await receive(particle, source);
        return cp<ExtendedParticles>("Particles", result) as common.Particles;
    },
    Sap: async (particle) => {
        try {
            switch (particle.data.type) {
                case "FileSystemPath":
                case "NodeModules":
                case "Url":
                    genes = require(particle.data.path).default;
                    break;
                case "InMemory":
                    genes = particle.data.genes;
                    break;
            }
            return common.cp("ACK");
        } catch (error: any) {
            return cp<Exception>("Exception", new sys.type.Exception(error.message));
        }
    }
});

export * from "./gene";
export * from "./gene.h";
