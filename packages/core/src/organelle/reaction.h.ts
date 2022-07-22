import {
    AllOrganelleParticles,
    InComingParticle,
    OutGoingParticle,
    InComingParticleNameUnion,
    // ToP
} from "./particles.h";
import { NucleusTransmit, OrganelleTransmit } from "./organelle-receive.h";
import {MakePromise} from "./utils"
// import { Particle } from "../particle";

// export type CP<
//     COP extends AllOrganelleParticles,
//     IPNU extends InComingParticleNameUnion<COP>
// > = ToP<OutGoingParticle<COP, IPNU, Class>>["data"] extends undefined
//     ? ToP<OutGoingParticle<COP, IPNU, Class>>["adds"] extends undefined
//         ? <Class extends string>(class_: Class) => Particle<Class>
//         : <Class extends string>(
//               class_: Class,
//               adds: ToP<OutGoingParticle<COP, IPNU, Class>>["adds"]
//           ) => OutGoingParticle<COP, IPNU, Class>
//     : ToP<OutGoingParticle<COP, IPNU, Class>>["adds"] extends undefined
//     ? <Class extends string>(
//           class_: Class,
//           data: ToP<OutGoingParticle<COP, IPNU, Class>>["data"]
//       ) => OutGoingParticle<COP, IPNU, Class>
//     : <Class extends string>(
//           class_: Class,
//           data: ToP<OutGoingParticle<COP, IPNU, Class>>["data"],
//           adds: ToP<OutGoingParticle<COP, IPNU, Class>>["adds"]
//       ) => OutGoingParticle<COP, IPNU, Class>;

export interface OrganelleReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<Exclude<OutGoingParticle<COP>, void>>;
            /**
             * createParticle
             */
            // cp: CreateOrganelleParticles<Outgoing<COP>>;
            // cp: CP<COP, IPNU>;
        }
    ): MakePromise<OutGoingParticle<COP, IPNU>>;
}

export interface NucleusReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: NucleusTransmit<Exclude<OutGoingParticle<COP>, void>>;
            /**
             * createParticle
             */
            // cp: <Class extends string>(
            //     class_: Class,
            //     data?: ToP<OutGoingParticle<COP, Class>>["data"],
            //     adds?: ToP<OutGoingParticle<COP, Class>>["adds"]
            //     //@ts-ignore
            // ) => Particle<Class, typeof data, Exclude<typeof adds, undefined>>;
        }
    ): Promise<OutGoingParticle<COP, IPNU> extends undefined ? void : OutGoingParticle<COP, IPNU>>;
}

export interface EndoplasmicReticulumReaction<
    COP extends AllOrganelleParticles,
    IPNU extends InComingParticleNameUnion<COP>
> {
    (
        particle: InComingParticle<COP, IPNU>,
        // tools: {
            /**
             * createParticle
             */
            // cp: <Class extends string>(
            //     class_: Class,
            //     data?: ToP<OutGoingParticle<COP, Class>>["data"],
            //     adds?: ToP<OutGoingParticle<COP, Class>>["adds"]
            //     //@ts-ignore
            // ) => Particle<Class, typeof data, Exclude<typeof adds, undefined>>;
        // }
    ): Promise<OutGoingParticle<COP, IPNU> extends undefined ? void : OutGoingParticle<COP, IPNU>>;
}
