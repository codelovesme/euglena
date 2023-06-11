import { ComingParticleUnion, CreateParticleUnion } from "@euglena/core";
import { Vacuole } from "./vacuole.org.h";
import { ReadParticle } from "./read-particle.par.h";

export const createVacuoleComingParticle = cp as CreateParticleUnion<ComingParticleUnion<Vacuole>>;

import { cp } from "@euglena/core";
import { genetics } from "../../../../cell";

export const getEuglenaName = async <O extends genetics.Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: genetics.GeneTransmit<O>,
    vacuole: V
) => {
    const getEuglenaName = cp<ReadParticle>("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    return await (t as genetics.GeneTransmit)(getEuglenaName, vacuole);
};
