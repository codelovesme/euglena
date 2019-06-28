import { MetaV2, MetaV3Optionals, MetaV3, MetaV1, ParticleV1, ParticleV2, ParticleV3, Particle } from "../particle";
export declare function createMetaV1(params: object): object;
export declare function createMetaV2(name: string, of: string, expireTime?: number): MetaV2;
export declare function createMetaV3<NameType>(name: NameType, optionals?: MetaV3Optionals): MetaV3<NameType>;
export declare function createParticle(meta: MetaV1, data?: any): ParticleV1;
export declare function createParticle<DataType>(meta: MetaV2, data?: DataType): ParticleV2<DataType>;
export declare function createParticle<NameType, DataType>(meta: MetaV3<NameType>, labels?: {
    [key: string]: unknown;
}, data?: DataType): ParticleV3<NameType, DataType>;
export declare function validateParticle(particle: Particle): boolean;
export declare function isParticleV1(particle: Particle): particle is ParticleV1;
export declare function isParticleV2(particle: Particle): particle is ParticleV2;
export declare function isParticleV3(particle: Particle): particle is ParticleV3;
export declare function assertNotParticle(particle: never, message: string): void;
/**
 * Aliases
 */
export declare const p: typeof createParticle;
export declare const m1: typeof createMetaV1;
export declare const m2: typeof createMetaV2;
export declare const m3: typeof createMetaV3;
