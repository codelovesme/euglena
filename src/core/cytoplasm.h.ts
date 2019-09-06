import { Particle, MetaAdditions } from "./particle.h";
import {
  OrganelleReceive,
  CreateOrganelleParticles,
  OutGoingParticleUnion,
  InComingParticleNameUnion,
  CreateParticles
} from "./organelle.h";
import { Chromosome } from "./gene.h";

export interface CytoplasmReceive {
  (sender: string, particle: Particle): void;
}

export interface OrganelleReaction<COP extends CreateOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
  (
    particle: ReturnType<COP["incoming"][IPNU]>,
    tools: {
      receive: (particle: OutGoingParticleUnion<COP>) => void;
      /**
       * Alias for receive
       */
      r: (particle: OutGoingParticleUnion<COP>) => void;

      createParticle: COP["outgoing"];
      /**
       * Alias for createParticle
       */
      cp: COP["outgoing"];
    }
  ): Promise<OutGoingParticleUnion<COP> | void>;
}

export interface Transmit {
  (organelleName: string, particle: Particle): Promise<Particle | void>;
}

export interface Cytoplasm {
  organelles: { [organelleName: string]: OrganelleReceive };
  chromosome: Chromosome;
}

export type CreateCytoplasmParticles = CreateParticles<{
  EuglenaHasBeenBorn: (adds?: MetaAdditions) => Particle<"EuglenaHasBeenBorn">;
}>;
