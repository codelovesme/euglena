import { findParticle, Meta, MetaAdditions, Particle } from "./particle.h";
export declare function createMeta<Class extends string, Additions extends MetaAdditions = {}>(class_: Class, adds?: Additions): Meta<Class, Additions>;
export declare function createParticle<P extends Particle>(class_: P["meta"]["class"], data?: P["data"], adds?: Omit<P["meta"], "class">): P;
export declare function assertNotParticle(particle: never, message: string): void;
export declare function isParticle(x: any): x is Particle;
export declare function isParticleClass<ParticleUnion extends Particle, Class extends ParticleUnion["meta"]["class"]>(particle: ParticleUnion, class_: Class): particle is findParticle<ParticleUnion, Class>;
/**
 * createParticle
 */
export declare const cp: typeof createParticle;
/**
 * createMeta
 */
export declare const cm: typeof createMeta;
//# sourceMappingURL=particle.d.ts.map