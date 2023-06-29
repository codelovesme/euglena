import { OrganelleInfo } from "./organelle";
import { CreateOrganelle, OrganelleReceive, Particle } from "@euglena/core";
type Transmit = (particle: Particle) => Promise<Particle>;
export declare const getOrganelles: () => {
    [organelleName: string]: OrganelleReceive<Particle<string, any, {}>, Particle<string, any, {}>>;
};
export declare const reviveOrganelle: ({ data }: OrganelleInfo) => Promise<CreateOrganelle<import("@euglena/core").OrganelleInteractions> | undefined>;
export declare const attachOrganelle: (organelleInfo: OrganelleInfo, transmit: Transmit) => Promise<void>;
export declare const transmit: (particle: Particle, target: string) => Promise<Particle<string, any, {}>>;
export declare const createEuglena: (particles: Particle[]) => Promise<void>;
/**
 * createEuglena
 */
export declare const ce: (particles: Particle[]) => Promise<void>;
export {};
//# sourceMappingURL=cell.u.d.ts.map