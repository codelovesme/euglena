import { Particle } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.h";

export type CheckAuthorization = Particle<
    "CheckAuthorization",
    {
        sender: EuglenaInfo;
        particle: string;
    }
>;
