import { particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.h";

export type CheckAuthorization = particle.Particle<
    "CheckAuthorization",
    {
        sender: EuglenaInfo;
        particle: string;
    }
>;
