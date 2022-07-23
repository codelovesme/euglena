// import { cp } from "@euglena/core";
// import { CommonParticles } from "./particles.h";

// const defineCommonParticles = <P extends Exclude<keyof CommonParticles, symbol | number>>(
//     particleNames: P[]
// ): CreateOrganelleParticles<CommonParticles> =>
//     particleNames.reduce(
//         (acc, curr) => ({
//             ...acc,
//             [curr]: cp.bind(undefined, curr)
//         }),
//         {} as any
//     );

// export const createCommonParticles = defineCommonParticles([
//     "ACK",
//     "NACK",
//     "EuglenaName",
//     "Exception",
//     "InvalidParticle",
//     "Log",
//     "Metas",
//     "NoReaction",
//     "Particles",
//     "GetAlive",
//     "Hibernate",
//     "EuglenaInfo",
//     "ReadParticle",
//     "SaveParticle",
//     "RemoveParticle",
//     "Impulse",
//     "DecryptedToken",
//     "EncryptedToken"
// ]);

// /**
//  * createCommonParticle
//  */
// export const ccp = createCommonParticles;
