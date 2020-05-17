import { P } from "..";
import { Particle } from "../..";
import { OrganelleModule, FromP } from "../organelle.h";
export declare type PEuglenaHasBeenBorn = P;
export declare type PTransmitParticle = P<{
    target: string;
    particle: Particle;
}>;
export declare type POrganelleInfo = P<{
    name: string;
    location: {
        type: "FileSystemPath" | "NodeModules" | "Url";
        path: string;
    } | {
        type: "InMemory";
        organelle: OrganelleModule;
    };
    nick?: string;
}>;
export declare type PTransmitResponse = P<Particle | void>;
export declare type TransmitParticle = FromP<"TransmitParticle", PTransmitParticle>;
export declare type OrganelleInfo = FromP<"OrganelleInfo", POrganelleInfo>;
export declare type TransmitResponse = FromP<"TransmitResponse", PTransmitResponse>;
export declare type EuglenaHasBeenBorn = FromP<"EuglenaHasBeenBorn", PEuglenaHasBeenBorn>;
