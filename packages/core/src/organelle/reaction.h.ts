import {
    AllOrganelleParticles,
    InComingParticle,
    OutGoingParticle,
    InComingParticleNameUnion,
    ToP
} from "./particles.h";
import { NucleusTransmit, OrganelleTransmit } from "./organelle-receive.h";
import { Particle } from "../particle";

export interface OrganelleReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<Exclude<OutGoingParticle<COP>,void>>;
            /**
             * createParticle
             */
            // cp: CreateOrganelleParticles<Outgoing<COP>>;
            cp: <Class extends string>(
                class_: Class,
                data?: ToP<OutGoingParticle<COP, Class>>["data"],
                adds?: ToP<OutGoingParticle<COP, Class>>["adds"]
                //@ts-ignore
                ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}

export interface NucleusReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: NucleusTransmit<Exclude<OutGoingParticle<COP>,void>>;
            /**
             * createParticle
             */
            cp: <Class extends string>(
                class_: Class,
                data?: ToP<OutGoingParticle<COP, Class>>["data"],
                adds?: ToP<OutGoingParticle<COP, Class>>["adds"]
                //@ts-ignore
                ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}

export interface EndoplasmicReticulumReaction<
    COP extends AllOrganelleParticles,
    IPNU extends InComingParticleNameUnion<COP>
> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * createParticle
             */
            cp: <Class extends string>(
                class_: Class,
                data?: ToP<OutGoingParticle<COP, Class>>["data"],
                adds?: ToP<OutGoingParticle<COP, Class>>["adds"]
                //@ts-ignore
                ) => Particle<Class, typeof data, Exclude<typeof adds,undefined>>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}
