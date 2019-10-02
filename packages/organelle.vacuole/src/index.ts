import { Particle, MetaAdditions, cp } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";
import { sys } from "cessnalib";

export type Count = "all" | number;

export default domc("Vacuole", {
    incoming: {
        SaveParticle: (
            particle: Particle,
            query?: sys.type.RecursivePartial<Particle>,
            count: Count = 1,
            adds?: MetaAdditions
        ) => cp("SaveParticle", { particle, query, count }, adds),
        ReadParticle: (query: sys.type.RecursivePartial<Particle>, count: Count = 1, adds?: MetaAdditions) =>
            cp("ReadParticle", { query, count }, adds),
        RemoveParticle: (query: sys.type.RecursivePartial<Particle>, count: Count = 1, adds?: MetaAdditions) =>
            cp("RemoveParticle", { query, count }, adds)
    },
    outgoing: {
        ACK: ccp.ACK,
        Exception: ccp.Exception,
        Particles: ccp.Particles,
        Metas: ccp.Metas
    }
});
