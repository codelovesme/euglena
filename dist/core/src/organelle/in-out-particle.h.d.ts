import { Particle } from "../particle";
import { OrganelleInteractions } from "./organelle-interactions.h";
import { Interaction } from "./interaction.h";
export type TriggerParticleFromInteraction<I extends Interaction> = I extends Particle[] ? I[0] : I;
export type ResponseParticleFromInteraction<I extends Interaction> = I extends [Particle, Particle] ? I[1] : never;
export type ComingParticleNameUnion<COP extends OrganelleInteractions> = TriggerParticleFromInteraction<COP["in"][number]>["meta"]["class"];
export type ComingParticleResponseUnion<COP extends OrganelleInteractions> = ResponseParticleFromInteraction<COP["in"][number]>;
export type ComingParticleResponseNameUnion<COP extends OrganelleInteractions> = ResponseParticleFromInteraction<COP["in"][number]>["meta"]["class"];
export type FindInteraction<InteractionUnion extends Interaction, Class extends string> = InteractionUnion extends Interaction<Particle<Class, any>> ? InteractionUnion : never;
export type ComingParticle<COP extends OrganelleInteractions, N extends ComingParticleNameUnion<COP>> = TriggerParticleFromInteraction<FindInteraction<COP["in"][number], N>>;
export type ComingParticleUnion<COP extends OrganelleInteractions> = TriggerParticleFromInteraction<COP["in"][number]>;
export type ComingParticleResponse<COP extends OrganelleInteractions, N extends ComingParticleNameUnion<COP> = ComingParticleNameUnion<COP>> = ResponseParticleFromInteraction<FindInteraction<COP["in"][number], N>>;
export type GoingParticleNameUnion<COP extends OrganelleInteractions> = TriggerParticleFromInteraction<COP["out"][number]>["meta"]["class"];
export type GoingParticleResponseUnion<COP extends OrganelleInteractions> = ResponseParticleFromInteraction<COP["out"][number]>;
export type GoingParticleResponseNameUnion<COP extends OrganelleInteractions> = ResponseParticleFromInteraction<COP["out"][number]>["meta"]["class"];
export type GoingParticle<COP extends OrganelleInteractions, N extends GoingParticleNameUnion<COP>> = TriggerParticleFromInteraction<FindInteraction<COP["out"][number], N>>;
export type GoingParticleUnion<COP extends OrganelleInteractions> = TriggerParticleFromInteraction<COP["out"][number]>;
export type GoingParticleResponse<COP extends OrganelleInteractions, N extends GoingParticleNameUnion<COP> = GoingParticleNameUnion<COP>> = ResponseParticleFromInteraction<FindInteraction<COP["out"][number], N>>;
export type AllParticleUnion<COP extends OrganelleInteractions> = ComingParticleUnion<COP> | GoingParticleUnion<COP> | ComingParticleResponseUnion<COP> | GoingParticleResponseUnion<COP>;
export type AllParticleNameUnion<COP extends OrganelleInteractions> = ComingParticleNameUnion<COP> | GoingParticleNameUnion<COP> | ComingParticleResponseNameUnion<COP> | GoingParticleResponseNameUnion<COP>;
import "./in-out-particle.h.spec";
//# sourceMappingURL=in-out-particle.h.d.ts.map