import { MetaAdditions, Particle } from "@euglena/particle";
import { sys } from "cessnalib";
export declare const createCommonParticle: {
    ACK: (adds?: MetaAdditions | undefined) => Particle<"ACK", undefined, MetaAdditions>;
    EuglenaName: (name: string, adds?: MetaAdditions | undefined) => Particle<"EuglenaName", string, MetaAdditions>;
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
    NoReaction: (adds?: MetaAdditions | undefined) => Particle<"NoReaction", undefined, MetaAdditions>;
    InvalidParticle: (adds?: MetaAdditions | undefined) => Particle<"InvalidParticle", MetaAdditions | undefined, MetaAdditions>;
    Log: (message: string, level: "Info" | "Error" | "Warning", adds?: MetaAdditions | undefined) => Particle<"Log", {
        message: string;
        level: "Info" | "Error" | "Warning";
    }, MetaAdditions>;
    Sap: <T>(organelle: {
        name: string;
        nick?: string | undefined;
    }, data: T) => Particle<"Sap", T, {
        organelle: {
            name: string;
            nick?: string | undefined;
        };
    }>;
};
export declare type CreateSap<T> = (organelle: {
    name: string;
    nick?: string;
}, data: T) => ReturnType<typeof createCommonParticle["Sap"]>;
/**
 * Alias for createCommonParticle
 */
export declare const ccp: {
    ACK: (adds?: MetaAdditions | undefined) => Particle<"ACK", undefined, MetaAdditions>;
    EuglenaName: (name: string, adds?: MetaAdditions | undefined) => Particle<"EuglenaName", string, MetaAdditions>;
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
    NoReaction: (adds?: MetaAdditions | undefined) => Particle<"NoReaction", undefined, MetaAdditions>;
    InvalidParticle: (adds?: MetaAdditions | undefined) => Particle<"InvalidParticle", MetaAdditions | undefined, MetaAdditions>;
    Log: (message: string, level: "Info" | "Error" | "Warning", adds?: MetaAdditions | undefined) => Particle<"Log", {
        message: string;
        level: "Info" | "Error" | "Warning";
    }, MetaAdditions>;
    Sap: <T>(organelle: {
        name: string;
        nick?: string | undefined;
    }, data: T) => Particle<"Sap", T, {
        organelle: {
            name: string;
            nick?: string | undefined;
        };
    }>;
};
