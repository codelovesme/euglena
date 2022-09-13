import { cp, OrganelleReceive, Particle } from "@euglena/core";
import { endoplasmicReticulumJs, Sap } from "./organelle/endoplasmic-reticulum";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive = endoplasmicReticulumJs({ name: "EndoplasmicReticulum" }) as OrganelleReceive;
    reticulumReceive(cp<Sap>("Sap", { reticulumReceive, particles }));
};

/**
 * createEuglena
 */
export const ce = createEuglena;
