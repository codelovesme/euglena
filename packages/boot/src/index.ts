import reticulum from "@euglena/organelle.endoplasmic-reticulum.js";
import { OrganelleReceive } from "@euglena/organelle";

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
