import { cp, Particle } from "@euglena/core";
import { endoplasmicReticulumJs, Sap } from "./organelle/endoplasmic-reticulum";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive: any = endoplasmicReticulumJs({ name: "EndoplasmicReticulum" });
    reticulumReceive(cp<Sap>("Sap", { reticulumReceive, particles }));
};

/**
 * createEuglena
 */
export const ce = createEuglena;
