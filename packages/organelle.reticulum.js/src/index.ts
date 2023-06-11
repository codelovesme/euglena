import * as core from "@euglena/core";
import { organelle, attachOrganelle, particle, transmit } from "@euglena/template";

import reticulum = organelle.reticulum;
import Reticulum = reticulum.Reticulum;

const dco = core.organelle.dco;

export type Sap = particle.common.Sap;

export default dco<Reticulum, Sap>({
    Sap: async (p) => {},
    OrganelleInfo: async (particle, { t }) => {
        return await attachOrganelle(particle, t as unknown as core.organelle.OrganelleTransmit);
    },
    TransmitParticle: async (p) => {
        return await transmit(p.data.particle, p.data.target);
    }
});
