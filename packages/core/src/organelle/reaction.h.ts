import {
    AllOrganelleParticles,
    InComingParticle,
    OutGoingParticle,
    CreateOrganelleParticles,
    InComingParticleNameUnion
} from "./particles.h";
import { NucleusTransmit, OrganelleTransmit } from "./organelle-receive.h";

export interface OrganelleReaction<COP extends AllOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (
        particle: InComingParticle<COP, IPNU>,
        tools: {
            /**
             * transmit
             */
            t: OrganelleTransmit<OutGoingParticle<COP>>;
            /**
             * createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
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
            t: NucleusTransmit<OutGoingParticle<COP>>;
            /**
             * createParticle
             */
            cp: CreateOrganelleParticles<COP["outgoing"]>;
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
            cp: CreateOrganelleParticles<COP["outgoing"]>;
        }
    ): Promise<OutGoingParticle<COP> | void>;
}
