import { sys } from "cessnalib";
import { Particle } from "./particle";
export interface CytoplasmReceive {
    (particle: Particle, sender: string): sys.type.Observable<Particle>;
}
export interface OrganelleReaction {
    (particle: Particle, tools: {
        receive: (particle: Particle) => sys.type.Observable<Particle>;
    }): Promise<Particle | void>;
}
export interface Transmit {
    (organelleName: string, particle: Particle): Promise<Particle | void>;
}
