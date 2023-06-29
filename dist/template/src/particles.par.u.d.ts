import { Particle } from "@euglena/core";
import { Particles } from "./particles.par.h";
export declare const getParticle: <P extends Particle<string, any, {}>>(particles: Particles, particleName: P["meta"]["class"]) => P | undefined;
export declare const getFirstParticle: <P extends Particle<string, any, {}>>(particles: Particles<P>) => P | undefined;
//# sourceMappingURL=particles.par.u.d.ts.map