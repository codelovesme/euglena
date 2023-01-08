import { EuglenaInfo } from "./euglena-info.h";
import { Permission } from "./permission.h";
import { Session } from "./session.h";
import { CheckAuthorization } from "./check-authorization.h";
import { Pulse } from "./pulse.h";
import { CreateEuglenaInfo } from "./create-euglena-info.h";

export type AuthParticle = EuglenaInfo | Session | Permission | CheckAuthorization | CreateEuglenaInfo | Pulse;
