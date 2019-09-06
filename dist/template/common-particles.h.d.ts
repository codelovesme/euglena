import { sys } from "cessnalib";
import { MetaAdditions, Particle, Meta } from "../core/particle.h";
import { CreateParticles, ParticleNameUnion, ParticleType } from "../core/organelle.h";
export declare type Count = "all" | number;
export declare type OrganelleInfoLocationType = "FileSystemPath" | "NodeModules" | "Url";
/**
 * TODO:
 * Must be type checked
 * like particlenames and particles
 * Ex. CreateCommonParticle = CreateParticle<{...}>
 */
export declare type CreateCommonParticles = CreateParticles<{
    EuglenaName: (name: string, adds?: MetaAdditions) => Particle<"EuglenaName", string>;
    ACK: (adds?: MetaAdditions) => Particle<"ACK">;
    Exception: (message: string, innerException?: sys.type.Exception, adds?: MetaAdditions) => Particle<"Exception", sys.type.Exception>;
    Particles: (particlesArray: Particle[], adds?: MetaAdditions) => Particle<"Particles", Particle[]>;
    Metas: (metas: Meta[], adds?: MetaAdditions) => Particle<"Metas">;
    NoReaction: (adds?: MetaAdditions) => Particle<"NoReaction">;
    OrganelleInfo: (organelleName: string, location: {
        type: OrganelleInfoLocationType;
        path: string;
    }, adds?: MetaAdditions) => Particle<"OrganelleInfo", {
        name: string;
        location: {
            type: OrganelleInfoLocationType;
            path: string;
        };
    }>;
    EuglenaHasBeenBorn: (adds?: MetaAdditions) => Particle<"EuglenaHasBeenBorn">;
    SaveParticle: (particle: Particle, query?: sys.type.RecursivePartial<Particle>, count?: Count, adds?: MetaAdditions) => Particle<"SaveParticle", {
        particle: Particle;
        query?: sys.type.RecursivePartial<Particle>;
        count: Count;
    }>;
    ReadParticle: (query: sys.type.RecursivePartial<Particle>, count?: Count, adds?: MetaAdditions) => Particle<"ReadParticle", {
        query: sys.type.RecursivePartial<Particle>;
        count: Count;
    }>;
    RemoveParticle: (query: sys.type.RecursivePartial<Particle>, count?: Count, adds?: MetaAdditions) => Particle<"RemoveParticle", {
        query: sys.type.RecursivePartial<Particle>;
        count: Count;
    }>;
    InvalidParticle: (adds?: MetaAdditions) => Particle<"InvalidParticle">;
}>;
export declare type CommonParticleType<PNU extends ParticleNameUnion<CreateCommonParticles>> = ParticleType<CreateCommonParticles, PNU>;
