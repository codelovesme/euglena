import { Log } from "../../log";
import { Coordinate } from "../../../env/geo/coordinate.par.h";
import { Listen } from "./listen.par.h";
import { createOrganelleInteractions } from "@euglena/core";
import { ACK, Exception } from "../../../type";

export type GpsReceiver = createOrganelleInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Coordinate, Log];
}>;
