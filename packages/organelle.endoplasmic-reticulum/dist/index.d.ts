import { Particle } from "@euglena/particle";
declare const _default: import("@euglena/organelle").CreateOrganelleModuleInterface<"EndoplasmicReticulum", {
    incoming: {
        TransmitParticle: (particle: Particle<string, unknown, {}>, target: string) => Particle<"TransmitParticle", {
            target: string;
            particle: Particle<string, unknown, {}>;
        }, {}>;
        OrganelleInfo: (name: string, location: {
            type: "FileSystemPath" | "NodeModules" | "Url";
            path: string;
        }, nick?: string | undefined) => Particle<"OrganelleInfo", {
            name: string;
            location: {
                type: "FileSystemPath" | "NodeModules" | "Url";
                path: string;
            };
            nick: string | undefined;
        }, {}>;
    };
    outgoing: {
        Log: (message: string, level: "Info" | "Error" | "Warning", adds?: import("@euglena/particle").MetaAdditions | undefined) => Particle<"Log", {
            message: string;
            level: "Info" | "Error" | "Warning";
        }, import("@euglena/particle").MetaAdditions>;
        TransmitResponse: (particle: void | Particle<string, unknown, {}>) => Particle<"TransmitResponse", void | Particle<string, unknown, {}>, {}>;
        EuglenaHasBeenBorn: () => Particle<"EuglenaHasBeenBorn", undefined, {}>;
    };
}>;
export default _default;
