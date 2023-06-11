import { Particle  } from "@euglena/core";
import { EuglenaInfo } from "./euglena-info.par.h";

export type CheckAuthorization = Particle<
    "CheckAuthorization",
    {
        sender: EuglenaInfo;
        particle: string;
    }
>;
