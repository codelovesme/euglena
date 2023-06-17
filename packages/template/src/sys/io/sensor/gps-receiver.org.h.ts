import { Log } from "../../../log";
import { Coordinate } from "../../../env/geo/coordinate.par.h";
import { Listen } from "./listen.par.h";
import { createOrganelleInteractions } from "@euglena/core";
import { ACK } from "../../../ack.par.h";
import { Exception } from "../../../exception.par.h";

export type GpsReceiver = createOrganelleInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Coordinate, Log];
}>;
