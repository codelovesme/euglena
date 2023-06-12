import { EuglenaInfo } from "./euglena-info.par.h";
import { CheckAuthorization } from "./check-authorization.par.h";
import { CreateEuglenaInfo } from "./create-euglena-info.par.h";
import { Session } from "./session.par.h";
import { Permission } from "./permission.par.h";
import { Pulse } from "./pulse.par.h";
import { GetMyApi } from "../api";

export type AuthParticle =
    | EuglenaInfo
    | Session
    | Permission
    | CheckAuthorization
    | CreateEuglenaInfo
    | Pulse
    | GetMyApi;