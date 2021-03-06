import { js, sys } from "cessnalib";
import { nucleus } from "./create-organelle-module";
import { Particle } from "../../../particle";
import { Gene, GeneReaction } from "./gene.h";
import { NucleusTransmit } from "../../../organelle/organelle-receive.h";
import { P } from "../../../organelle/particles.h";
import { ccp } from "../../particle";

let genes: Gene[] = [];
let receive: (particle: Particle<string, unknown, {}>, source: string) => Promise<Particle<string, unknown, {}>[]>;

const createReceive = (t: NucleusTransmit) => async (
    particle: Particle,
    source: string
): Promise<Particle<string, unknown, {}>[]> => {
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
    //get rid of overridden reactions
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
            doTrigger = genes[tr2.index].data.override !== genes[tr.index].data.name;
        }
        if (doTrigger) {
            reactions.push(tr.reaction);
            names.push(genes[tr.index].data.name);
        }
    }
    //trigger collected reactions
    let promises: Promise<Particle | void>[] = [];
    for (let i = 0; i < reactions.length; i++) {
        let reaction: GeneReaction = reactions[i];
        const geneName: string = names[i];
        console.log(`Info - Triggering Gene: ${geneName} Particle: ${JSON.stringify(particle.meta)}`);
        promises = [
            ...promises,
            reaction(particle, source, {
                t: t
            })
        ];
    }
    const allResults = await Promise.all(promises);
    return allResults.filter((x) => x !== undefined) as Particle<string, unknown, {}>[];
};

const nucleusJs = nucleus.com<
    P<{ path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { genes: Gene[]; type: "InMemory" }>
>({
    ReceiveParticle: async (p) => {
        const { particle, source } = p.data;
        const result = await receive(particle, source);
        if (result.length > 0) {
            return ccp.Particles(result);
        }
        return;
    },
    Sap: async (particle, { t, cp }) => {
        receive = createReceive(t as NucleusTransmit);
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
            return cp.ACK();
        } catch (error) {
            return cp.Exception(new sys.type.Exception(error.message));
        }
    }
});

export { nucleusJs };
