import { ACK } from "./ack.h";
import { NACK } from "./nack.h";
import { Log } from "./log.h";
import { Exception } from "./exception.h";
import { GetAlive } from "./get-alive.h";
import { OrganelleInfo } from "./organelle-info.h";
import { Particles } from "./particles.h";
import { Sap } from "./sap.h";

export type CommonParticle = ACK | NACK | Log | Exception | GetAlive | OrganelleInfo | Particles | Sap;
