import { Particle, cp, dco } from "@euglena/core";
import { ACK, Exception, Particles, cell } from "@euglena/template";
import * as cessnalib from "cessnalib";
let genes: cell.genetics.Gene[] = [];

const receive = async (particle: Particle, source: string) => {
    console.log(`Info - Received particle ${particle.meta.class} inside the Nucleus`);

    //find which genes are matched with properties of the particle
    const triggerableReactions = new Array<{
        index: number;
        triggers: string[];
        reaction: cell.genetics.GeneReaction<Particle, cell.genetics.Organelles>;
        organelles: cell.genetics.Stringify<cell.genetics.Organelles>;
    }>();
    for (let i = 0; i < genes.length; i++) {
        let triggers: any = genes[i].data.triggers;
        if (cessnalib.js.Class.doesMongoCover(particle, triggers)) {
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
    const reactions = Array<[cell.genetics.GeneReaction<Particle, cell.genetics.Organelles>, cell.genetics.Stringify<cell.genetics.Organelles>]>();
    const names = Array<string>();
    for (let tr of triggerableReactions) {
        let doTrigger = true;
        //Check if the tr is contained by others, if true
        for (let tr2 of triggerableReactions) {
            //if it is the same object, do nothing
            if (tr.index === tr2.index) continue;
            //then if triggers of tr2 does not contain triggers of tr, do nothing
            if (!cessnalib.sys.StaticTools.Array.containsArray(tr2.triggers, tr.triggers)) continue;
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
                t: async (particle: Particle, target: string) => {
                    console.log(`Info - Transmitting particle: ReadParticle to organelle aliased ${target} in gene`);
                    return (await cell.transmit(particle, organelles[target])) as any
                },
                o: organelles
            })
        ];
    }
    const allResults = await Promise.all(promises);
    const result = allResults.filter((x) => x !== undefined) as Particle[];
    return cp<Particles>("Particles", result);
};

export type Sap = cell.organelle.Sap<
    { path: string; type: "FileSystemPath" | "NodeModules" | "Url" } | { genes: cell.genetics.Gene[]; type: "InMemory" }
>;

export default dco<cell.genetics.Nucleus, [Sap, ACK | Exception]>({
    ReceiveParticle: async (p) => {
        const { particle, source } = p.data;
        return await receive(particle, source);
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
            return cp("ACK") as ACK;
        } catch (error: any) {
            return cp<Exception>("Exception", new cessnalib.sys.Exception(error.message));
        }
    },
    GetGenes: async () => {
        return cp<Particles>("Particles", genes) as any;
    }
});