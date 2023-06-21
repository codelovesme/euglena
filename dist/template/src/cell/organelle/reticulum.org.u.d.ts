export declare const createReticulumComingParticle: ((class_: "OrganelleInfo", data: {
    name: string;
    location: {
        type: "FileSystemPath" | "NodeModules" | "Url";
        path: string;
    } | {
        type: "InMemory";
        organelle: import("@euglena/core").CreateOrganelle<import("@euglena/core").OrganelleInteractions>;
    };
}) => import("./organelle-info.par.h").OrganelleInfo) & ((class_: "TransmitParticle", data: {
    target: string;
    particle: import("@euglena/core").Particle<string, any, {}>;
}) => import("./transmit-particle.par.h").TransmitParticle);
//# sourceMappingURL=reticulum.org.u.d.ts.map