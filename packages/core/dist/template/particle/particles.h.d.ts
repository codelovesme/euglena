import { sys } from "cessnalib";
import { Particle, Meta } from "../../particle";
import { OrganelleParticles, P, FromP } from "../../organelle";
export declare type Count = "all" | number;
export declare type PACK = P<undefined>;
export declare type PEuglenaName = P<string>;
export declare type PException = P<sys.type.Exception>;
export declare type PParticles = P<Particle[]>;
export declare type PMetas = P<Meta[]>;
export declare type PNoReaction = P<undefined>;
export declare type PInvalidParticle = P<undefined>;
export declare type PLog = P<{
    message: string;
    level: "Error" | "Info" | "Warning";
}>;
export declare type PGetAlive = P<undefined>;
export declare type PHibernate = P<undefined>;
export declare type PEuglenaInfo = P<{
    id: string;
    name: string;
    description: string;
}>;
export declare type PReadParticle = P<{
    query: sys.type.RecursivePartial<Particle>;
    count: "all" | number;
}>;
export declare type PSaveParticle = P<{
    particle: Particle;
    query?: sys.type.RecursivePartial<Particle>;
    count: Count;
} | Particle[]>;
export declare type PRemoveParticle = P<{
    query: sys.type.RecursivePartial<Particle>;
    count: Count;
}>;
export declare type PImpulse = P<{
    particle: Particle;
    source: string;
    token?: string;
}>;
export declare type PEncryptedToken = P<string>;
export declare type PDecryptedToken = P<{
    euglenaName: string;
    createdAt: number;
    expireAt: number;
    type: string;
    roles: string[];
    status: "Active" | "Deactive" | "Deleted";
}>;
export declare type ACK = FromP<"ACK", PACK>;
export declare type EuglenaName = FromP<"EuglenaName", PEuglenaName>;
export declare type Exception = FromP<"Exception", PException>;
export declare type Particles = FromP<"Particles", PParticles>;
export declare type Metas = FromP<"Metas", PMetas>;
export declare type NoReaction = FromP<"NoReaction", PNoReaction>;
export declare type InvalidParticle = FromP<"InvalidParticle", PInvalidParticle>;
export declare type Log = FromP<"Log", PLog>;
export declare type GetAlive = FromP<"GetAlive", PGetAlive>;
export declare type Hibernate = FromP<"Hibernate", PHibernate>;
export declare type EuglenaInfo = FromP<"EuglenaInfo", PEuglenaInfo>;
export declare type ReadParticle = FromP<"ReadParticle", PReadParticle>;
export declare type SaveParticle = FromP<"SaveParticle", PSaveParticle>;
export declare type RemoveParticle = FromP<"RemoveParticle", PRemoveParticle>;
export declare type Impulse = FromP<"Impulse", PImpulse>;
export declare type EncryptedToken = FromP<"EncryptedToken", PEncryptedToken>;
export declare type DecryptedToken = FromP<"DecryptedToken", PDecryptedToken>;
export declare type CommonParticles = OrganelleParticles<{
    ACK: PACK;
    EuglenaName: PEuglenaName;
    Exception: PException;
    Particles: PParticles;
    Metas: PMetas;
    NoReaction: PNoReaction;
    InvalidParticle: PInvalidParticle;
    Log: PLog;
    GetAlive: PGetAlive;
    Hibernate: PHibernate;
    EuglenaInfo: PEuglenaInfo;
    ReadParticle: PReadParticle;
    SaveParticle: PSaveParticle;
    RemoveParticle: PRemoveParticle;
    Impulse: PImpulse;
    EncryptedToken: PEncryptedToken;
    DecryptedToken: PDecryptedToken;
}>;
