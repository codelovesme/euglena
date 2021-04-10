import { CreateOrganelleParticles } from "../../organelle";
export declare const createCommonParticles: CreateOrganelleParticles<{
    ACK: import("../../organelle").P<undefined, {}>;
    EuglenaName: import("../../organelle").P<string, {}>;
    Exception: import("../../organelle").P<import("cessnalib").sys.type.Exception, {}>;
    Particles: import("../../organelle").P<import("../../particle").Particle<string, unknown, {}>[], {}>;
    Metas: import("../../organelle").P<{
        class: string;
    }[], {}>;
    NoReaction: import("../../organelle").P<undefined, {}>;
    InvalidParticle: import("../../organelle").P<undefined, {}>;
    Log: import("../../organelle").P<{
        message: string;
        level: "Error" | "Info" | "Warning";
    }, {}>;
    GetAlive: import("../../organelle").P<undefined, {}>;
    Hibernate: import("../../organelle").P<undefined, {}>;
    EuglenaInfo: import("../../organelle").P<{
        id: string;
        name: string;
        description: string;
    }, {}>;
    ReadParticle: import("../../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>>;
        count: number | "all";
    }, {}>;
    SaveParticle: import("../../organelle").P<{
        particle: import("../../particle").Particle<string, unknown, {}>;
        query?: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>> | undefined;
        count: number | "all";
    } | import("../../particle").Particle<string, unknown, {}>[], {}>;
    RemoveParticle: import("../../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>>;
        count: number | "all";
    }, {}>;
    Impulse: import("../../organelle").P<{
        particle: import("../../particle").Particle<string, unknown, {}>;
        source: string;
        token?: string | undefined;
    }, {}>;
    EncryptedToken: import("../../organelle").P<string, {}>;
    DecryptedToken: import("../../organelle").P<{
        euglenaName: string;
        createdAt: number;
        expireAt: number;
        type: string;
        roles: string[];
        status: "Active" | "Deactive" | "Deleted";
    }, {}>;
}>;
/**
 * createCommonParticle
 */
export declare const ccp: CreateOrganelleParticles<{
    ACK: import("../../organelle").P<undefined, {}>;
    EuglenaName: import("../../organelle").P<string, {}>;
    Exception: import("../../organelle").P<import("cessnalib").sys.type.Exception, {}>;
    Particles: import("../../organelle").P<import("../../particle").Particle<string, unknown, {}>[], {}>;
    Metas: import("../../organelle").P<{
        class: string;
    }[], {}>;
    NoReaction: import("../../organelle").P<undefined, {}>;
    InvalidParticle: import("../../organelle").P<undefined, {}>;
    Log: import("../../organelle").P<{
        message: string;
        level: "Error" | "Info" | "Warning";
    }, {}>;
    GetAlive: import("../../organelle").P<undefined, {}>;
    Hibernate: import("../../organelle").P<undefined, {}>;
    EuglenaInfo: import("../../organelle").P<{
        id: string;
        name: string;
        description: string;
    }, {}>;
    ReadParticle: import("../../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>>;
        count: number | "all";
    }, {}>;
    SaveParticle: import("../../organelle").P<{
        particle: import("../../particle").Particle<string, unknown, {}>;
        query?: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>> | undefined;
        count: number | "all";
    } | import("../../particle").Particle<string, unknown, {}>[], {}>;
    RemoveParticle: import("../../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../../particle").Particle<string, unknown, {}>>;
        count: number | "all";
    }, {}>;
    Impulse: import("../../organelle").P<{
        particle: import("../../particle").Particle<string, unknown, {}>;
        source: string;
        token?: string | undefined;
    }, {}>;
    EncryptedToken: import("../../organelle").P<string, {}>;
    DecryptedToken: import("../../organelle").P<{
        euglenaName: string;
        createdAt: number;
        expireAt: number;
        type: string;
        roles: string[];
        status: "Active" | "Deactive" | "Deleted";
    }, {}>;
}>;
