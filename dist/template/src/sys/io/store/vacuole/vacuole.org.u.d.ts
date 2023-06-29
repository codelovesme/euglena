import { ReadParticle } from "./read-particle.par.h";
import { GeneTransmit, Organelles } from "../../../../cell/genetics/gene.par.h";
export declare const createVacuoleComingParticle: ((class_: "GetAlive") => import("../../../../cell/organelle").GetAlive) & ((class_: "Hibernate") => import("./hibernate.par.h").Hibernate) & ((class_: "SaveParticle", data: import("@euglena/core").Particle<string, any, {}>[] | {
    particle: import("@euglena/core").Particle<string, any, {}>;
    query?: import("cessnalib").sys.RecursivePartial<import("@euglena/core").Particle<string, any, {}>> | undefined;
    count: import("./count.h").Count;
}) => import("./save-particle.par.h").SaveParticle<import("@euglena/core").Particle<string, any, {}>>) & ((class_: "ReadParticle", data: {
    query: import("cessnalib").sys.RecursivePartial<import("@euglena/core").Particle<string, any, {}>>;
    count: import("./count.h").Count;
}) => ReadParticle<import("@euglena/core").Particle<string, any, {}>>) & ((class_: "RemoveParticle", data: {
    query: import("cessnalib").sys.RecursivePartial<import("@euglena/core").Particle<string, any, {}>>;
    count: import("./count.h").Count;
}) => import("./remove-particle.par.h").RemoveParticle<import("@euglena/core").Particle<string, any, {}>>);
export declare const getEuglenaName: <O extends Organelles, V extends Exclude<keyof O, number | symbol>>(t: import("cessnalib/dist/ts").IntersectionFromUnion<{ [P in keyof O]: import("cessnalib/dist/ts").IntersectionFromUnion<{ [P_1 in import("@euglena/core").ComingParticleNameUnion<O[P]>]: (particle: import("@euglena/core").TriggerParticleFromInteraction<import("@euglena/core").FindInteraction<O[P]["in"][number], P_1>>, organelleName: Exclude<P, number | symbol>) => Promise<import("@euglena/core").ResponseParticleFromInteraction<import("@euglena/core").FindInteraction<O[P]["in"][number], import("@euglena/core").ComingParticleNameUnion<O[P]>>> extends undefined ? void : import("@euglena/core").ResponseParticleFromInteraction<import("@euglena/core").FindInteraction<O[P]["in"][number], P_1>>>; }[import("@euglena/core").ComingParticleNameUnion<O[P]>]>; }[keyof O]>, vacuole: V) => Promise<import("@euglena/core").Particle<string, any, {}>>;
//# sourceMappingURL=vacuole.org.u.d.ts.map