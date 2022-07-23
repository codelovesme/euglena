import { domc } from "@euglena/core";
import {
    GetAlive,
    Hibernate,
    Particles,
    ReadParticle,
    RemoveParticle,
    SaveParticle
} from "../particle";

/**
 * TODO:
 * Remove javascript 
 * Keep just type definition here which particle it takes and which particles returns, throws
 */
const vacuole = {
    v1: domc<
        [
            [SaveParticle],
            [ReadParticle, Particles],
            [RemoveParticle],
            [GetAlive],
            [Hibernate]
        ]
    >()
};

export { vacuole };
