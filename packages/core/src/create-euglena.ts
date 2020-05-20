import { endoplasmicReticulumJs as reticulum } from "./organelle";
import { OrganelleReceive } from "./organelle";
import { Particle } from "./particle";

const reticulumName: string = "EndoplasmicReticulum";

export const createEuglena = (particles: Particle[]) => {
    const reticulumReceive: OrganelleReceive = reticulum.createOrganelle(reticulumName);
    reticulumReceive(
        reticulum.cp.incoming.Sap(
            {
                reticulumReceive: reticulumReceive,
                particles: particles
            },
            { organelleName: reticulumName }
        )
    );
};

/**
 * Alias for createEuglena
 */
export const ce = createEuglena;
