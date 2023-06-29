import { Particle } from "@euglena/core";
import { Permission } from "./permission.par.h";
import { Vacuole } from "../../store/vacuole";
export type GivePermission = Particle<"GivePermission", {
    to: Permission["data"]["sender"];
    particles: string[];
}>;
export declare const createGeneGivePermission: (organelles: import("../../../../cell/genetics").Stringify<{
    vacuole: Vacuole;
}>) => import("../../../../cell/genetics").Gene<Particle<string, any, {}>, import("../../../../cell/genetics").Organelles>;
//# sourceMappingURL=give-permission.gene.d.ts.map