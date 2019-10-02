import { CreateParticle, CreateMeta } from "./particle.h";
export declare const createMeta: CreateMeta;
export declare const createParticle: CreateParticle;
export declare function assertNotParticle(particle: never, message: string): void;
/**
 * Alias for createParticle
 */
export declare const cp: CreateParticle;
/**
 * Alias for createMeta
 */
export declare const cm: CreateMeta;
