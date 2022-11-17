import { Particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.h";

export type AuthenticatedImpulse = Particle<"AuthenticatedImpulse", {
    particle:Particle,
    sender: EuglenaInfo
}>;
