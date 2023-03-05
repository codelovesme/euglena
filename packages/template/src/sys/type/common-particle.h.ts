import { ACK } from "./ack.h";
import { NACK } from "./state/type/nack.h";
import { Log } from "./log.h";
import { Exception } from "./interaction/exception/exception.h";
import { GetAlive } from "./sys/organelle/get-alive.h";
import { OrganelleInfo } from "./organelle-info.h";
import { Particles } from "./state/type/particles/particles.h";
import { Sap } from "./sys/organelle/sap.h";
import { EuglenaName } from "../../logic/euglena-name.h";
import { ReviveOrganelle } from "./revive-organelle.h";
import { EuglenaHasBeenBorn } from "./euglena-has-been-born.h";
import { Api } from "./api.h";
import { GetApi } from "./get-api.h";

export type CommonParticle =
    | ACK
    | NACK
    | Log
    | Exception
    | GetAlive
    | OrganelleInfo
    | Particles
    | Sap
    | EuglenaName
    | ReviveOrganelle
    | EuglenaHasBeenBorn
    | GetApi
    | Api;
