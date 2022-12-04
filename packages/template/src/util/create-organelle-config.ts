import { particle } from "@euglena/core";
import { OrganelleInfo, Sap } from "../particle/common";

export type OrganelleConfig = {
    name: string;
    particles: particle.Particle[];
};

export const createOrganelleConfig = (name: string, organelleInfo: OrganelleInfo, sap?: Sap): OrganelleConfig => ({
    name,
    particles: sap ? [organelleInfo, sap] : [organelleInfo]
});
