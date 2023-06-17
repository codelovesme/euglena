import { OrganelleTransmit, dco } from "@euglena/core";
import { cell } from "@euglena/template";

export default dco<cell.organelle.Reticulum, cell.organelle.Sap>({
    Sap: async (p) => {},
    OrganelleInfo: async (particle, { t }) => {
        return await cell.attachOrganelle(particle, t as unknown as OrganelleTransmit);
    },
    TransmitParticle: async (p) => {
        return await cell.transmit(p.data.particle, p.data.target);
    }
});
