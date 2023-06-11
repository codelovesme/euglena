import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "../../../log";
import { Listen } from "../listen.par.h";
import { Temperature } from "./temperature.par.h";
import { ACK, Exception } from "../../../../type";

export type Thermometer = createOrganelleInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Temperature, Log];
}>;


