import { Particle, MetaAdditions } from "../../core/particle.h";
export declare const vacuole: import("../..").OrganelleModule<"Vacuole", {
    incoming: {
        ReadParticle: (query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"ReadParticle", {
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: import("..").Count;
        }, {}>;
        SaveParticle: (particle: Particle<string, unknown, {}>, query?: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"SaveParticle", {
            particle: Particle<string, unknown, {}>;
            query?: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined;
            count: import("..").Count;
        }, {}>;
        RemoveParticle: (query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"RemoveParticle", {
            query: import("cessnalib").sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: import("..").Count;
        }, {}>;
        VacuoleSap: (particles: Particle<string, unknown, {}>[], adds?: MetaAdditions | undefined) => Particle<"VacuoleSap", Particle<string, unknown, {}>[], {}>;
    };
    outgoing: {
        ACK: (adds?: MetaAdditions | undefined) => Particle<"ACK", unknown, {}>;
        Exception: (message: string, innerException?: import("cessnalib").sys.type.Exception | undefined, adds?: MetaAdditions | undefined) => Particle<"Exception", import("cessnalib").sys.type.Exception, {}>;
        Particles: (particlesArray: Particle<string, unknown, {}>[], adds?: MetaAdditions | undefined) => Particle<"Particles", Particle<string, unknown, {}>[], {}>;
        Metas: (metas: {
            id: string;
            name: string;
            createTime: number;
            expireTime?: number | undefined;
        }[], adds?: MetaAdditions | undefined) => Particle<"Metas", unknown, {}>;
    };
}>;
