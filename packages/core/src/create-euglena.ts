import { endoplasmicReticulumJs } from "./template/organelle/endoplasmic-reticulum";
import { OrganelleReceive } from "./organelle/organelle-receive.h";
import { Particle } from "./particle";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive = endoplasmicReticulumJs.co() as OrganelleReceive;
    reticulumReceive(endoplasmicReticulumJs.cs({ reticulumReceive, particles }));
};

/**
 * createEuglena
 */
export const ce = createEuglena;
