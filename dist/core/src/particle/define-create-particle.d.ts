import { Particle } from "./particle.h";
export declare const defineCreateParticle: <ParticleUnion extends Particle<string, any, {}>>() => import("cessnalib/dist/ts").UnionToIntersection<ParticleUnion extends infer P extends Particle<string, any, {}> ? import("./create-particle.h").CreateParticle<P> : never>;
export declare const dcp: <ParticleUnion extends Particle<string, any, {}>>() => import("cessnalib/dist/ts").UnionToIntersection<ParticleUnion extends infer P extends Particle<string, any, {}> ? import("./create-particle.h").CreateParticle<P> : never>;
//# sourceMappingURL=define-create-particle.d.ts.map