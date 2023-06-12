import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "../../log";
import { Listen } from "./listen.par.h";
import { ACK, Exception } from "../../../type";
import { Temperature } from "../../../env";

export type Thermometer = createOrganelleInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Temperature, Log];
}>;


