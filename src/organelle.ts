import { Particle } from "./particle";
import { CytoplasmReceive, Reaction } from "./cytoplasm";

export interface OrganelleReceive {
  (particle: Particle): Promise<Particle | void>;
}

export interface CreateOrganelle {
  (receive: CytoplasmReceive): OrganelleReceive;
}

export interface CreateParticle<K> {
  (name: K, ...remains: any): Particle;
}

export interface OrganelleDefaultExport<T1 extends string, T2 extends CreateOrganelle, T3 extends CreateParticle<string>, T4 extends { [key: string]: string }>
  extends Array<T1 | T2 | T3 | T4> {
  0: T1;
  1: T2;
  2: T3;
  3: T4;
}
