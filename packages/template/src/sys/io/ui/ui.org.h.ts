import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "../../../log";
import { Event } from "./event.par.h";
import { Render } from "./render.par.h";
import { ACK } from "../../../ack.par.h";
import { Exception } from "../../../exception.par.h";

export type UI = createOrganelleInteractions<{
    in: [[Render, ACK | Exception]];
    out: [Log, Event];
}>;
