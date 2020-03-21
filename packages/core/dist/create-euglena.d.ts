import { OrganelleReceive } from "./organelle";
export declare const createEuglena: (createSap: (reticulumReceive: OrganelleReceive<import("./particle").Particle<string, any, {
    [x: string]: any;
}>, import("./particle").Particle<string, any, {
    [x: string]: any;
}>>) => import("./particle").Particle<"Sap", {
    particles: import("./particle").Particle<string, any, {
        [x: string]: any;
    }>[];
    reticulumReceive: OrganelleReceive<import("./particle").Particle<string, any, {
        [x: string]: any;
    }>, import("./particle").Particle<string, any, {
        [x: string]: any;
    }>>;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>) => void;
/**
 * Alias for createEuglena
 */
export declare const ce: (createSap: (reticulumReceive: OrganelleReceive<import("./particle").Particle<string, any, {
    [x: string]: any;
}>, import("./particle").Particle<string, any, {
    [x: string]: any;
}>>) => import("./particle").Particle<"Sap", {
    particles: import("./particle").Particle<string, any, {
        [x: string]: any;
    }>[];
    reticulumReceive: OrganelleReceive<import("./particle").Particle<string, any, {
        [x: string]: any;
    }>, import("./particle").Particle<string, any, {
        [x: string]: any;
    }>>;
}, {
    organelle: {
        name: string;
        nick?: string | undefined;
    };
}>) => void;
