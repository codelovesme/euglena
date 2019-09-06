import { MetaAdditions, Particle } from "../core/particle.h";
import { CreateCommonParticles, Count, OrganelleInfoLocationType } from "./common-particles.h";
import { sys } from "cessnalib";
export declare const createCommonParticle: CreateCommonParticles;
/**
 * Alias for createCommonParticle
 */
export declare const ccp: {
    EuglenaName: (name: string, adds?: MetaAdditions | undefined) => Particle<"EuglenaName", string, {}>;
    ACK: (adds?: MetaAdditions | undefined) => Particle<"ACK", unknown, {}>;
    Exception: (message: string, innerException?: sys.type.Exception | undefined, adds?: MetaAdditions | undefined) => Particle<"Exception", sys.type.Exception, {}>;
    Particles: (particlesArray: Particle<string, unknown, {}>[], adds?: MetaAdditions | undefined) => Particle<"Particles", Particle<string, unknown, {}>[], {}>;
    Metas: (metas: {
        id: string;
        name: string;
        createTime: number;
        expireTime?: number | undefined;
    }[], adds?: MetaAdditions | undefined) => Particle<"Metas", unknown, {}>;
    NoReaction: (adds?: MetaAdditions | undefined) => Particle<"NoReaction", unknown, {}>;
    OrganelleInfo: (organelleName: string, location: {
        type: OrganelleInfoLocationType;
        path: string;
    }, adds?: MetaAdditions | undefined) => Particle<"OrganelleInfo", {
        name: string;
        location: {
            type: OrganelleInfoLocationType;
            path: string;
        };
    }, {}>;
    EuglenaHasBeenBorn: (adds?: MetaAdditions | undefined) => Particle<"EuglenaHasBeenBorn", unknown, {}>;
    SaveParticle: (particle: Particle<string, unknown, {}>, query?: sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"SaveParticle", {
        particle: Particle<string, unknown, {}>;
        query?: sys.type.RecursivePartial<Particle<string, unknown, {}>> | undefined;
        count: Count;
    }, {}>;
    ReadParticle: (query: sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"ReadParticle", {
        query: sys.type.RecursivePartial<Particle<string, unknown, {}>>;
        count: Count;
    }, {}>;
    RemoveParticle: (query: sys.type.RecursivePartial<Particle<string, unknown, {}>>, count?: number | "all" | undefined, adds?: MetaAdditions | undefined) => Particle<"RemoveParticle", {
        query: sys.type.RecursivePartial<Particle<string, unknown, {}>>;
        count: Count;
    }, {}>;
    InvalidParticle: (adds?: MetaAdditions | undefined) => Particle<"InvalidParticle", unknown, {}>;
};
