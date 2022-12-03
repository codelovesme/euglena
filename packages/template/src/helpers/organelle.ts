import { particle } from "@euglena/core";

export type OrganelleConfig = {
    name: string;
    particles: particle.Particle[];
};

export const createOrganelleConfig = (name: string, particles: particle.Particle[]): OrganelleConfig => ({
    name,
    particles
});
