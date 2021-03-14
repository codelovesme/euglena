import { cp } from "../particle";
import { CommonParticles } from "./particles.h";
import { CreateOrganelleParticles } from "../organelle";

const defineCommonParticles = <P extends keyof CommonParticles>(
    particleNames: P[]
): CreateOrganelleParticles<CommonParticles> =>
    particleNames.reduce(
        (acc, curr) => ({
            ...acc,
            [curr]: cp.bind(undefined, curr)
        }),
        {} as any
    );

export const createCommonParticles = defineCommonParticles([
    "ACK",
    "EuglenaName",
    "Exception",
    "InvalidParticle",
    "Log",
    "Metas",
    "NoReaction",
    "Particles",
    "GetAlive",
    "Hibernate",
    "EuglenaInfo",
    "ReadParticle",
    "SaveParticle",
    "RemoveParticle",
    "Impulse"
]);

/**
 * createCommonParticle
 */
export const ccp = createCommonParticles;
