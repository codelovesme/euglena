import { createOrganelleInteractions } from "@euglena/core";
import { Log } from "../../../log";
import { Listen } from "./listen.par.h";
import { Temperature } from "../../../env";
import { ACK } from "../../../ack.par.h";
import { Exception } from "../../../exception.par.h";
export type Thermometer = createOrganelleInteractions<{
    in: [[Listen, ACK | Exception]];
    out: [Temperature, Log];
}>;
//# sourceMappingURL=thermometer.org.h.d.ts.map