import { EuglenaInfo } from "./euglena-info.par.h";
import { CreateEuglenaInfo } from "./create-euglena-info.par.h";
import { Session } from "./session.par.h";
import { Permission } from "./permission.par.h";
import { GetMyApi } from "../api";

export type AuthParticle =
    | EuglenaInfo
    | Session
    | Permission
    | CreateEuglenaInfo
    | GetMyApi;