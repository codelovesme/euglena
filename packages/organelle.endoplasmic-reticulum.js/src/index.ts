import { dco, Particle } from "@euglena/core";
import { organelle, attachOrganelle, particle, transmit } from "@euglena/template";

import endoplasmicReticulum = organelle.endoplasmicReticulum;
import EndoplasmicReticulum = endoplasmicReticulum.EndoplasmicReticulum;
import common = particle.common;
import Sap = common.Sap;

export default dco<EndoplasmicReticulum, Sap>({
    Sap: async (p) => {},
    OrganelleInfo: async (particle, { t }) => {
        return await attachOrganelle(particle, t as (particle: Particle) => Promise<Particle | void>);
    },
    TransmitParticle: async (p) => {
        return await transmit(p.data.particle, p.data.target);
    }
});
