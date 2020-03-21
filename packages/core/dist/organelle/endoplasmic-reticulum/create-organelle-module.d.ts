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
declare const _default: import("..").CreateOrganelleModuleInterface<"EndoplasmicReticulum", {
    incoming: {
        TransmitParticle: P<{
            target: string;
            particle: Particle<string, any, {
                [x: string]: any;
            }>;
        }, {}>;
        OrganelleInfo: P<{
            name: string;
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            } | {
                type: "InMemory";
                organelle: OrganelleModule<string, import("..").AllOrganelleParticles<{
                    [x: string]: P<any, {}>;
                }, {
                    [x: string]: P<any, {}>;
                }>>;
            };
            nick?: string | undefined;
        }, {}>;
    };
    outgoing: {
        Log: P<{
            message: string;
            level: "Error" | "Info" | "Warning";
        }, {}>;
        TransmitResponse: P<void | Particle<string, any, {
            [x: string]: any;
        }>, {}>;
        EuglenaHasBeenBorn: P<any, {}>;
    };
}>;
export default _default;
