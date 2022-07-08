import { OrganelleReceive, Particle } from "@euglena/core";
import { endoplasmicReticulumJs } from "./organelle/endoplasmic-reticulum";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive = endoplasmicReticulumJs.co() as OrganelleReceive;
    reticulumReceive(endoplasmicReticulumJs.cs({ reticulumReceive, particles }));
};

/**
 * createEuglena
 */
export const ce = createEuglena;
