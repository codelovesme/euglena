import * as core from "@euglena/core";
import { organelle, attachOrganelle, particle, transmit } from "@euglena/template";

import endoplasmicReticulum = organelle.endoplasmicReticulum;
import EndoplasmicReticulum = endoplasmicReticulum.EndoplasmicReticulum;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;

export type Sap = particle.common.Sap;

export default dco<EndoplasmicReticulum, Sap>({
    Sap: async (p) => {},
    OrganelleInfo: async (particle, { t }) => {
        return await attachOrganelle(particle, t as (particle: Particle) => Promise<Particle | void>);
    },
    TransmitParticle: async (p) => {
        return await transmit(p.data.particle, p.data.target);
    }
});
