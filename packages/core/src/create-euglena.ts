import { endoplasmicReticulumJs as reticulum } from "./organelle";
import { OrganelleReceive } from "./organelle";

export const createEuglena = (
    createSap: (reticulumReceive: OrganelleReceive) => ReturnType<typeof reticulum["cp"]["incoming"]["Sap"]>
) => {
    const reticulumReceive: OrganelleReceive = reticulum.createOrganelle();
    const reticulumSap = createSap(reticulumReceive);
    reticulumReceive(reticulumSap);
};

/**
 * Alias for createEuglena
 */
export const ce = createEuglena;
