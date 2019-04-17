import { MetaV2, MetaV3Optionals, MetaV3, MetaV1, ParticleV1, ParticleV2, ParticleV3, Meta, Particle } from "../particle";
import { sys } from "cessnalib";
export declare function createMetaV1(params: object): object;
export declare function createMetaV2(name: string, of: string, expireTime?: number): MetaV2;
export declare function createMetaV3<NameType>(name: NameType, createdBy: string, optionals?: MetaV3Optionals): MetaV3<NameType>;
export declare function createParticle(meta: MetaV1, data?: any): ParticleV1;
export declare function createParticle<DataType>(meta: MetaV2, data?: DataType): ParticleV2<DataType>;
export declare function createParticle<NameType, DataType>(meta: MetaV3<NameType>, labels?: {
    [key: string]: unknown;
}, data?: DataType): ParticleV3<NameType, DataType>;
export declare function validateParticle(particle: Particle): boolean;
/**
 * Common particles
 */
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
export declare function createCommonParticle(name: typeof commonParticles.EuglenaName, createdBy: string, optionals?: MetaV3Optionals): commonParticles.EuglenaName;
export declare function createCommonParticle(name: typeof commonParticles.ACK, createdBy: string, optionals?: MetaV3Optionals): commonParticles.ACK;
export declare function createCommonParticle(name: typeof commonParticles.Exception, createdBy: string, message: string, innerException?: sys.type.Exception, optionals?: MetaV3Optionals): commonParticles.Exception;
export declare function createCommonParticle(name: typeof commonParticles.Particles, createdBy: string, particlesArray: Particle[], optionals?: MetaV3Optionals): commonParticles.Particles;
export declare function createCommonParticle(name: typeof commonParticles.Metas, createdBy: string, metas: Meta[], optionals?: MetaV3Optionals): commonParticles.Metas;
export declare function createCommonParticle(name: typeof commonParticles.NoReaction, createdBy: string, optionals?: MetaV3Optionals): commonParticles.NoReaction;
export declare function createCommonParticle(name: typeof commonParticles.OrganelleInfo, createdBy: string, organelleName: string, location: OrganelleInfoLocation, optionals?: MetaV3Optionals): commonParticles.OrganelleInfo;
export declare function createCommonParticle(name: typeof commonParticles.EuglenaHasBeenBorn, createdBy: string, optionals?: MetaV3Optionals): commonParticles.EuglenaHasBeenBorn;
/**
 * Aliases
 */
export declare const p: typeof createParticle;
export declare const pc: typeof createCommonParticle;
export declare const m1: typeof createMetaV1;
export declare const m2: typeof createMetaV2;
export declare const m3: typeof createMetaV3;
