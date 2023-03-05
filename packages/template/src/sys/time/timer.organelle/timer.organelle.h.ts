import { organelle } from "@euglena/core";
import { ReadTime } from "../read-time.particle.h";
import { Time } from "../time.particle.h";
import { SetTime } from "../set-time.particle.h";
import { ACK } from "../../ack.particle.h";

export type Timer = organelle.extendOrganelleInteractions<{
    in: [[ReadTime, Time], [SetTime, ACK]];
    out: [Time];
}>;

