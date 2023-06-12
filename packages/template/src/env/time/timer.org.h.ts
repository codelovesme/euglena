import { createOrganelleInteractions } from "@euglena/core";
import { ReadTime } from "./read-time.par.h";
import { Time } from "./time.par.h";
import { SetTime } from "./set-time.par.h";
import { ACK } from "../../type";

export type Timer = createOrganelleInteractions<{
    in: [[ReadTime, Time], [SetTime, ACK]];
    out: [Time];
}>;

