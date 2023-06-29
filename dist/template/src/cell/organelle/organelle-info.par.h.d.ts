import { CreateOrganelle, Particle } from "@euglena/core";
export type OrganelleInfo = Particle<"OrganelleInfo", {
    name: string;
    location: {
        type: "FileSystemPath" | "NodeModules" | "Url";
        path: string;
    } | {
        type: "InMemory";
        organelle: CreateOrganelle;
    };
}>;
//# sourceMappingURL=organelle-info.par.h.d.ts.map