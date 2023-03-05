import { organelle } from "@euglena/core";
import { ACK } from "../../../interaction/ack.particle.h";
import { Log } from "../log.particle.h";

import extendOrganelleInteractions = organelle.extendOrganelleInteractions;

export type Logger = extendOrganelleInteractions<{
    in: [[Log, ACK]];
    out: [];
}>;

