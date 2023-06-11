import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "../../log";
import { Event } from "./event.par.h";
import { Render } from "./render.par.h";
import { ACK, Exception } from "../../../type";

export type UI = createOrganelleInteractions<{
    in: [[Render, ACK | Exception]];
    out: [Log, Event];
}>;
