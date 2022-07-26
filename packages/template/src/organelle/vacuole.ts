import { domc, Exception, Particle } from "@euglena/core";
import { GetAlive, Hibernate, Log, Metas, ReadParticle, RemoveParticle, SaveParticle } from "../particle";

/**
 * TODO:
 * Remove javascript
 * Keep just type definition here which particle it takes and which particles returns, throws
 */
const vacuole = {
    v1: domc<{
        in: [[SaveParticle, Metas], [ReadParticle, Particle<"Particles",Particle[]>], [RemoveParticle], [GetAlive], [Hibernate]];
        out: [[Log], [Exception]];
    }>()
};

export { vacuole };
