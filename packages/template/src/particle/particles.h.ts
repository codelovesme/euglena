import { P, Particle, Meta, FromP } from "@euglena/core";
import { sys } from "cessnalib";

export type Count = "all" | number;

export type PNACK = P<undefined>;
export type PEuglenaName = P<string>;
export type PParticles = P<Particle[]>;
export type PMetas = P<Meta[]>;
export type PNoReaction = P<undefined>;
export type PInvalidParticle = P<undefined>;
export type PLog = P<{ message: string; level: "Error" | "Info" | "Warning" }>;
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
    token?: string;
}>;

export type PEncryptedToken = P<string>;

/**
 * Use PDecryptedTokenV2 instead of this.
 * The status has been changed
 */
export type PDecryptedToken = P<{
    euglenaName: string;
    createdAt: number;
    expireAt: number;
    type: string;
    roles: string[];
    status: "Active" | "Deactive" | "Deleted";
}>;
export type PDecryptedTokenV2 = P<
    {
        euglenaName: string;
        createdAt: number;
        expireAt: number;
        type: string;
        roles: string[];
        status: "Active" | "Deactive" | "NeedsVerification";
    },
    { version: "2.0" }
>;
export type NACK = FromP<"NACK", PNACK>;
export type EuglenaName = FromP<"EuglenaName", PEuglenaName>;

export type Particles = FromP<"Particles", PParticles>;
export type Metas = FromP<"Metas", PMetas>;
export type NoReaction = FromP<"NoReaction", PNoReaction>;
export type InvalidParticle = FromP<"InvalidParticle", PInvalidParticle>;
export type Log = FromP<"Log", PLog>;

export type Hibernate = FromP<"Hibernate", PHibernate>;
export type EuglenaInfo = FromP<"EuglenaInfo", PEuglenaInfo>;
export type ReadParticle = FromP<"ReadParticle", PReadParticle>;
export type SaveParticle = FromP<"SaveParticle", PSaveParticle>;
export type RemoveParticle = FromP<"RemoveParticle", PRemoveParticle>;
export type Impulse = FromP<"Impulse", PImpulse>;
export type EncryptedToken = FromP<"EncryptedToken", PEncryptedToken>;
export type DecryptedToken = FromP<"DecryptedToken", PDecryptedToken>;
export type DecryptedTokenV2 = FromP<"DecryptedToken", PDecryptedTokenV2>;

export type PGetAlive = P<undefined>;
export type GetAlive = FromP<"GetAlive", PGetAlive>;