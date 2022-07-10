import { domc } from "@euglena/core";
import {
    ACK,
    Exception,
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
            [SaveParticle, ACK | Exception],
            [ReadParticle, Particles | Exception],
            [RemoveParticle, ACK | Exception],
            [GetAlive, ACK | Exception],
            [Hibernate, ACK | Exception]
        ]
    >()
};

export { vacuole };
