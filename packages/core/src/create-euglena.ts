import { endoplasmicReticulumJs as reticulum } from "./template/organelle";
import { OrganelleReceive } from "./organelle/organelle-receive.h";
import { Particle } from "./particle";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive: OrganelleReceive = reticulum.co() as any;
    reticulumReceive(
        reticulum.cs({
            reticulumReceive: reticulumReceive,
            particles: particles
        })
    );
};

/**
 * createEuglena
 */
export const ce = createEuglena;
