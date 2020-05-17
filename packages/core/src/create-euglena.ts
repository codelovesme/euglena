import { endoplasmicReticulumJs as reticulum } from "./organelle";
import { OrganelleReceive } from "./organelle";
import { Particle } from "./particle";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive: OrganelleReceive = reticulum.createOrganelle();
    reticulumReceive(
        reticulum.cp.incoming.Sap(
            {
                reticulumReceive: reticulumReceive,
                particles: particles
            },
            { organelle: { name: reticulum.n } }
        )
    );
};

/**
 * Alias for createEuglena
 */
export const ce = createEuglena;
