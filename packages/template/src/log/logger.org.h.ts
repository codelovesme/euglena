import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "./log.par.h";
import { ACK } from "../ack.par.h";

export type Logger = createOrganelleInteractions<{
    in: [[Log, ACK]];
    out: [];
}>;

