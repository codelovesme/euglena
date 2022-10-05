import { Particle, OrganelleReceive, cp, dco } from "@euglena/core";
import { organelle, attachOrganelle, getOrganelles, particle } from "@euglena/template";

import endoplasmicReticulum = organelle.endoplasmicReticulum;
import EndoplasmicReticulum = endoplasmicReticulum.EndoplasmicReticulum;
import TransmitResponse = endoplasmicReticulum.TransmitResponse;
import S = particle.common.Sap;
import ccp = particle.ccp;

export type Sap = S<{ particles: Particle[]; reticulumReceive: OrganelleReceive }>;

export const endoplasmicReticulumJs = dco<EndoplasmicReticulum, [Sap]>({
    Sap: async (p, { t }) => {},
    OrganelleInfo: async (particle, { t }) => {
        attachOrganelle(particle, t);
    },
    TransmitParticle: async (p) => {
        const { target, particle } = p.data;
        const organelles = getOrganelles();
        const organelleReceive: OrganelleReceive = organelles[target];
        if (!organelleReceive)
            return cp<TransmitResponse>(
                "TransmitResponse",
                ccp("Log", { message: `Organelle ${target} has not been connected yet!`, level: "Error" })
            );
        const resp = await organelleReceive(particle);
        return cp<TransmitResponse>("TransmitResponse", resp);
    }
});
