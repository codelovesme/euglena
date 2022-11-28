import { particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.h";

export type AuthenticatedImpulse = particle.Particle<
    "AuthenticatedImpulse",
    {
        particle: particle.Particle;
        sender: EuglenaInfo;
    }
>;
