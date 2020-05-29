import { endoplasmicReticulumJs as reticulum } from "./organelle/kind";
import { OrganelleReceive } from "./organelle/organelle-receive.h";
import { Particle } from "./particle";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive: OrganelleReceive = reticulum.co() as any;
    reticulumReceive(
        reticulum.cp.incoming.Sap({
            reticulumReceive: reticulumReceive,
            particles: particles
        })
    );
};

/**
 * Alias for createEuglena
 */
export const ce = createEuglena;
