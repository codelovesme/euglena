import nucleus from "@euglena/organelle.nucleus";
import { Particle } from "@euglena/particle";
import { js, sys } from "cessnalib";
import { Gene, GeneReaction } from "./gene.h";
import { OrganelleTransmit } from "@euglena/organelle";

let genes: Gene[] = [];
let receive: (particle: Particle, sourceOrganelle: string) => void;

const createReceive = (t: OrganelleTransmit, cp: typeof nucleus.cp.outgoing) => (
    particle: Particle,
    source: string
) => {
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
        console.log(`Triggering Gene: ${geneName} Particle: ${JSON.stringify(particle.meta)}`);
        reaction(particle, source, {
            transmit: t,
            t: t
        });
    }
};

export default nucleus.com<{ path: string; type: "FileSystemPath" | "NodeModules" | "Url" }>({
    Sap: async (particle, { t, cp }) => {
        receive = createReceive(t, cp);
        try {
            switch (particle.data.type) {
                case "FileSystemPath":
                case "NodeModules":
                case "Url":
                    genes = require(particle.data.path).default;
            }
            return cp.ACK();
        } catch (error) {
            return cp.Exception(error.message);
        }
    },
    ReceiveParticle: async (p) => {
        const { particle, source } = p.data;
        return receive(particle, source);
    }
});
