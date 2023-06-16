import { cp, ComingParticleUnion, CreateParticleUnion } from "@euglena/core";
import { Vacuole } from "./vacuole.org.h";
import { ReadParticle } from "./read-particle.par.h";
import { GeneTransmit, Organelles } from "../../../../cell/genetics/gene.par.h";

export const createVacuoleComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Vacuole>>;


export const getEuglenaName = async <O extends Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: GeneTransmit<O>,
    vacuole: V
) => {
    const getEuglenaName = cp<ReadParticle>("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    return await (t as GeneTransmit)(getEuglenaName, vacuole);
};
