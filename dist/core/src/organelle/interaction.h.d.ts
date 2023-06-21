import { Particle } from "../particle";
import { ResponseParticleFromInteraction, TriggerParticleFromInteraction } from "./in-out-particle.h";
export type Interaction<P extends Particle = Particle, P2 extends Particle = Particle> = P | [P] | [P, P2];
export type InteractionInName<I extends Interaction> = ResponseParticleFromInteraction<I>["meta"]["class"] extends never ? TriggerParticleFromInteraction<I>["meta"]["class"] | [TriggerParticleFromInteraction<I>["meta"]["class"]] : [TriggerParticleFromInteraction<I>["meta"]["class"], ResponseParticleFromInteraction<I>["meta"]["class"]];
import "./interaction.h.spec";
//# sourceMappingURL=interaction.h.d.ts.map