import { Particle } from "../particle";
import { OrganelleReceive } from "./organelle-receive.h";
export declare type CreateOrganelle<InComingParticle extends Particle = Particle, OutGoingParticle extends Particle = Particle> = <OrganelleName extends string>(params: {
    name: OrganelleName;
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;
export declare type CreateSingletonOrganelle<InComingParticle extends Particle = Particle, OutGoingParticle extends Particle = Particle> = (params: {
    transmit: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
}) => OrganelleReceive<InComingParticle, OutGoingParticle>;
export declare type CreateEndoplasmicReticulum<InComingParticle extends Particle = Particle, OutGoingParticle extends Particle = Particle> = () => OrganelleReceive<InComingParticle, OutGoingParticle>;
