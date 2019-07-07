import { Particle } from "./particle";
import { CytoplasmReceive } from "./cytoplasm";

export interface OrganelleReceive {
  (particle: Particle): Promise<Particle | void>;
}

export interface CreateOrganelle {
  (receive: CytoplasmReceive): OrganelleReceive;
}

export interface CreateParticle<K> {
  (name: K, ...remains: any): Particle;
}

export interface OrganelleDefaultExport<
  T1 extends string,
  T2 extends CreateOrganelle,
  T3 extends CreateParticle<string>,
  T4 extends CreateParticle<string>,
  T5 extends { [key: string]: string },
  T6 extends { [key: string]: string }
> {
  organelleName: T1;
  createOrganelle: T2;
  createIncomingParticle: T3;
  createOutgoingParticle: T4;
  incomingParticles: T5;
  outgoingParicles: T6;
}
