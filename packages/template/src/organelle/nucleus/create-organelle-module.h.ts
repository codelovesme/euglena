import { AllInteractions, Log, Particle } from "@euglena/core";
import { Particles } from "../../utils/particles";

export type Namespace = "Nucleus";

export type ReceiveParticle = Particle<
    "ReceiveParticle",
    { particle: Particle; source: string },
    { namespace: Namespace }
>;

export type Nucleus = AllInteractions<{
    in: [[ReceiveParticle, Particles]];
    out: [Log];
}>;
