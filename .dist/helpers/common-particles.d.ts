import { ParticleV3, Particle, Meta, MetaV3Optionals } from "..";
import { sys } from "cessnalib";
export declare enum OrganelleInfoLocationType {
    FileSystemPath = 0,
    NodeModules = 1,
    Url = 2
}
export interface OrganelleInfoLocation {
    type: OrganelleInfoLocationType;
    path: string;
}
export declare namespace commonParticles {
    const EuglenaName: "EuglenaName";
    type EuglenaName = ParticleV3<typeof EuglenaName, string>;
    const ACK: "ACK";
    type ACK = ParticleV3<typeof ACK, true>;
    const Exception: "Exception";
    type Exception = ParticleV3<typeof Exception, sys.type.Exception>;
    const Particles: "Particles";
    type Particles = ParticleV3<typeof Particles, Particle[]>;
    const Metas: "Metas";
    type Metas = ParticleV3<typeof Metas, Meta[]>;
    const NoReaction: "NoReaction";
    type NoReaction = ParticleV3<typeof NoReaction, undefined>;
    const OrganelleInfo: "OrganelleInfo";
    type OrganelleInfo = ParticleV3<typeof OrganelleInfo, {
        name: string;
        location: {
            type: OrganelleInfoLocationType;
            path: string;
        };
    }>;
    const EuglenaHasBeenBorn: "EuglenaHasBeenBorn";
    type EuglenaHasBeenBorn = ParticleV3<typeof EuglenaHasBeenBorn>;
}
export declare type CommonParticles = commonParticles.ACK | commonParticles.EuglenaName | commonParticles.Exception | commonParticles.Particles | commonParticles.Metas | commonParticles.NoReaction | commonParticles.OrganelleInfo;
export declare function createCommonParticle(name: typeof commonParticles.EuglenaName, optionals?: MetaV3Optionals): commonParticles.EuglenaName;
export declare function createCommonParticle(name: typeof commonParticles.ACK, optionals?: MetaV3Optionals): commonParticles.ACK;
export declare function createCommonParticle(name: typeof commonParticles.Exception, message: string, innerException?: sys.type.Exception, optionals?: MetaV3Optionals): commonParticles.Exception;
export declare function createCommonParticle(name: typeof commonParticles.Particles, particlesArray: Particle[], optionals?: MetaV3Optionals): commonParticles.Particles;
export declare function createCommonParticle(name: typeof commonParticles.Metas, metas: Meta[], optionals?: MetaV3Optionals): commonParticles.Metas;
export declare function createCommonParticle(name: typeof commonParticles.NoReaction, optionals?: MetaV3Optionals): commonParticles.NoReaction;
export declare function createCommonParticle(name: typeof commonParticles.OrganelleInfo, organelleName: string, location: OrganelleInfoLocation, optionals?: MetaV3Optionals): commonParticles.OrganelleInfo;
export declare function createCommonParticle(name: typeof commonParticles.EuglenaHasBeenBorn, optionals?: MetaV3Optionals): commonParticles.EuglenaHasBeenBorn;
/**
 * Aliases
 */
export declare const pc: typeof createCommonParticle;
