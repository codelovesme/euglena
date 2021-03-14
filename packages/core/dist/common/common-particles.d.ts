import { CreateOrganelleParticles } from "../organelle";
export declare const createCommonParticles: CreateOrganelleParticles<{
    ACK: import("../organelle").P<undefined, {}>;
    EuglenaName: import("../organelle").P<string, {}>;
    Exception: import("../organelle").P<import("cessnalib").sys.type.Exception, {}>;
    Particles: import("../organelle").P<import("../particle").Particle<string, any, {
        [x: string]: any;
    }>[], {}>;
    Metas: import("../organelle").P<{
        class: string;
        createdAt: number;
        expireAt?: number | undefined;
    }[], {}>;
    NoReaction: import("../organelle").P<undefined, {}>;
    InvalidParticle: import("../organelle").P<undefined, {}>;
    Log: import("../organelle").P<{
        message: string;
        level: "Warning" | "Error" | "Info";
    }, {}>;
    GetAlive: import("../organelle").P<undefined, {}>;
    Hibernate: import("../organelle").P<undefined, {}>;
    EuglenaInfo: import("../organelle").P<{
        id: string;
        name: string;
        description: string;
    }, {}>;
    ReadParticle: import("../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>>;
        count: number | "all";
    }, {}>;
    SaveParticle: import("../organelle").P<{
        particle: import("../particle").Particle<string, any, {
            [x: string]: any;
        }>;
        query?: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>> | undefined;
        count: number | "all";
    } | import("../particle").Particle<string, any, {
        [x: string]: any;
    }>[], {}>;
    RemoveParticle: import("../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>>;
        count: number | "all";
    }, {}>;
    Impulse: import("../organelle").P<{
        particle: import("../particle").Particle<string, any, {
            [x: string]: any;
        }>;
        source: string;
        token: string;
    }, {}>;
}>;
/**
 * createCommonParticle
 */
export declare const ccp: CreateOrganelleParticles<{
    ACK: import("../organelle").P<undefined, {}>;
    EuglenaName: import("../organelle").P<string, {}>;
    Exception: import("../organelle").P<import("cessnalib").sys.type.Exception, {}>;
    Particles: import("../organelle").P<import("../particle").Particle<string, any, {
        [x: string]: any;
    }>[], {}>;
    Metas: import("../organelle").P<{
        class: string;
        createdAt: number;
        expireAt?: number | undefined;
    }[], {}>;
    NoReaction: import("../organelle").P<undefined, {}>;
    InvalidParticle: import("../organelle").P<undefined, {}>;
    Log: import("../organelle").P<{
        message: string;
        level: "Warning" | "Error" | "Info";
    }, {}>;
    GetAlive: import("../organelle").P<undefined, {}>;
    Hibernate: import("../organelle").P<undefined, {}>;
    EuglenaInfo: import("../organelle").P<{
        id: string;
        name: string;
        description: string;
    }, {}>;
    ReadParticle: import("../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>>;
        count: number | "all";
    }, {}>;
    SaveParticle: import("../organelle").P<{
        particle: import("../particle").Particle<string, any, {
            [x: string]: any;
        }>;
        query?: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>> | undefined;
        count: number | "all";
    } | import("../particle").Particle<string, any, {
        [x: string]: any;
    }>[], {}>;
    RemoveParticle: import("../organelle").P<{
        query: import("cessnalib").sys.type.RecursivePartial<import("../particle").Particle<string, any, {
            [x: string]: any;
        }>>;
        count: number | "all";
    }, {}>;
    Impulse: import("../organelle").P<{
        particle: import("../particle").Particle<string, any, {
            [x: string]: any;
        }>;
        source: string;
        token: string;
    }, {}>;
}>;
