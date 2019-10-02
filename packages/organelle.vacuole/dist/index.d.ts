import { Particle, MetaAdditions } from "@euglena/particle";
import { sys } from "cessnalib";
export declare type Count = "all" | number;
declare const _default: import("@euglena/organelle").CreateOrganelleModuleInterface<"Vacuole", {
    incoming: {
        SaveParticle: (particle: Particle<string, unknown, {}>, query?: sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined, count?: Count, adds?: MetaAdditions | undefined) => Particle<"SaveParticle", {
            particle: Particle<string, unknown, {}>;
            query: sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined;
            count: Count;
        }, MetaAdditions>;
        ReadParticle: (query: sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: Count, adds?: MetaAdditions | undefined) => Particle<"ReadParticle", {
            query: sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: Count;
        }, MetaAdditions>;
        RemoveParticle: (query: sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: Count, adds?: MetaAdditions | undefined) => Particle<"RemoveParticle", {
            query: sys.type.RecursivePartial<Particle<string, unknown, {}>>;
            count: Count;
        }, MetaAdditions>;
    };
    outgoing: {
        ACK: (adds?: MetaAdditions | undefined) => Particle<"ACK", undefined, MetaAdditions>;
        Exception: (message: string, innerException?: sys.type.Exception | undefined, adds?: MetaAdditions | undefined) => Particle<"Exception", sys.type.Exception, MetaAdditions>;
        Particles: (particlesArray: Particle<string, unknown, {}>[], adds?: MetaAdditions | undefined) => Particle<"Particles", Particle<string, unknown, {}>[], MetaAdditions>;
        Metas: (metas: {
            id: string;
            name: string;
            createTime: number;
            expireTime?: number | undefined;
        }[], adds?: MetaAdditions | undefined) => Particle<"Metas", {
            id: string;
            name: string;
            createTime: number;
            expireTime?: number | undefined;
        }[], MetaAdditions>;
    };
}>;
export default _default;
