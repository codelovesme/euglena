import { CreateMeta, CreateParticle, IsParticleClass, Particle } from "./particle.h";
export declare const createMeta: CreateMeta;
export declare const createParticle: CreateParticle;
export declare function assertNotParticle(particle: never, message: string): void;
export declare function isParticle(x: any): x is Particle;
export declare const isParticleClass: IsParticleClass;
/**
 * createParticle
 */
export declare const cp: CreateParticle;
/**
 * createMeta
 */
export declare const cm: CreateMeta;
