import {
    AllOrganelleParticles,
    ComingParticle,
    ComingParticleNameUnion,
    ComingResponseParticle,
    ComingResponseParticleNameUnion,
    CreateParticleWithoutClass,
    Exception,
    GoingParticle,
    GoingParticleNameUnion,
    GoingParticles,
    GoingResponseParticle
} from "./particle";
import { NucleusTransmit, OrganelleTransmit } from "./organelle-receive.h";

export interface OrganelleReaction<COP extends AllOrganelleParticles, CPN extends ComingParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, CPN>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<
                GoingParticles<COP>,
                GoingResponseParticle<COP> extends undefined ? void : GoingResponseParticle<COP>
            >;
            /**
             * createParticle
             */
            cp: {
                [P in GoingParticleNameUnion<COP>]: CreateParticleWithoutClass<GoingParticle<COP, P>>;
            } & {
                [P in ComingResponseParticleNameUnion<COP>]: CreateParticleWithoutClass<ComingResponseParticle<COP, CPN>>;
            };
        }
    ): Promise<
        Exception | (ComingResponseParticle<COP, CPN> extends undefined ? void : ComingResponseParticle<COP, CPN>)
    >;
}

export interface NucleusReaction<COP extends AllOrganelleParticles, IPNU extends ComingResponseParticleNameUnion<COP>> {
    (
        particle: ComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: NucleusTransmit<Exclude<ComingResponseParticle<COP>, void>>;
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
    ): Promise<ComingResponseParticle<COP, IPNU> | Exception>;
}

export interface EndoplasmicReticulumReaction<
    COP extends AllOrganelleParticles,
    IPNU extends ComingResponseParticleNameUnion<COP>
> {
    (
        particle: ComingParticle<COP, IPNU>
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
    ): Promise<ComingResponseParticle<COP, IPNU> extends undefined ? void : ComingResponseParticle<COP, IPNU>>;
}
