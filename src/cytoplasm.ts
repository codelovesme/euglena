import { sys } from "cessnalib";
import { Particle } from "./particle";

export interface CytoplasmReceive {
  (particle: Particle): sys.type.Observable<Particle>;
}

export interface Reaction {
  (particle: Particle): Promise<Particle | void>;
}

export interface Transmit {
  (organelleName: string, particle: Particle): Promise<Particle | void>;
}
