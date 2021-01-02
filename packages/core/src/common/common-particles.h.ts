import { sys } from "cessnalib";
import { Particle, Meta } from "../particle";
import { OrganelleParticles, P, FromP } from "../organelle";

export type Count = "all" | number;

export type PACK = P<undefined>;
export type PEuglenaName = P<string>;
export type PException = P<sys.type.Exception>;
export type PParticles = P<Particle[]>;
export type PMetas = P<Meta[]>;
export type PNoReaction = P<undefined>;
export type PInvalidParticle = P<undefined>;
export type PLog = P<{ message: string; level: "Error" | "Info" | "Warning" }>;
export type PGetAlive = P<undefined>;
export type PHibernate = P<undefined>;
export type PEuglenaInfo = P<{
    id: string;
    name: string;
    description: string;
}>;
export type PReadParticle = P<{
    query: sys.type.RecursivePartial<Particle>;
    count: "all" | number;
}>;
export type PSaveParticle = P<
    | {
          particle: Particle;
          query?: sys.type.RecursivePartial<Particle>;
          count: Count;
      }
    | Particle[]
>;
export type PRemoveParticle = P<{ query: sys.type.RecursivePartial<Particle>; count: Count }>;
export type PImpulse = P<{
    particle: Particle;
    source: string;
    token: string;
}>;

export type ACK = FromP<"ACK", PACK>;
export type EuglenaName = FromP<"EuglenaName", PEuglenaName>;
export type Exception = FromP<"Exception", PException>;
export type Particles = FromP<"Particles", PParticles>;
export type Metas = FromP<"Metas", PMetas>;
export type NoReaction = FromP<"NoReaction", PNoReaction>;
export type InvalidParticle = FromP<"InvalidParticle", PInvalidParticle>;
export type Log = FromP<"Log", PLog>;
export type GetAlive = FromP<"GetAlive", PGetAlive>;
export type Hibernate = FromP<"Hibernate", PHibernate>;
export type EuglenaInfo = FromP<"EuglenaInfo", PEuglenaInfo>;
export type ReadParticle = FromP<"HibReadParticleernate", PReadParticle>;
export type SaveParticle = FromP<"SaveParticle", PSaveParticle>;
export type RemoveParticle = FromP<"RemoveParticle", PRemoveParticle>;
export type Impulse = FromP<"Impulse", PImpulse>;

export type CommonParticles = OrganelleParticles<{
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
}>;
