import { OrganelleReceive } from "@euglena/organelle";
export declare const createEuglena: (createSap: (reticulumReceive: OrganelleReceive<import("@euglena/particle").Particle<string, unknown, {}>, import("@euglena/particle").Particle<string, unknown, {}>>) => import("@euglena/particle").Particle<"Sap", {
    particles: import("@euglena/particle").Particle<string, unknown, {}>[];
    reticulumReceive: OrganelleReceive<import("@euglena/particle").Particle<string, unknown, {}>, import("@euglena/particle").Particle<string, unknown, {}>>;
}, {
    name: string;
    nick?: string | undefined;
}>) => void;
/**
 * Alias for createEuglena
 */
export declare const ce: (createSap: (reticulumReceive: OrganelleReceive<import("@euglena/particle").Particle<string, unknown, {}>, import("@euglena/particle").Particle<string, unknown, {}>>) => import("@euglena/particle").Particle<"Sap", {
    particles: import("@euglena/particle").Particle<string, unknown, {}>[];
    reticulumReceive: OrganelleReceive<import("@euglena/particle").Particle<string, unknown, {}>, import("@euglena/particle").Particle<string, unknown, {}>>;
}, {
    name: string;
    nick?: string | undefined;
}>) => void;
