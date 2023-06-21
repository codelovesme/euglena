import { Log } from "../../../../log";
import { Particle, createOrganelleInteractions } from "@euglena/core";
import { Impulse } from "./impulse.par.h";
export type NetClient = createOrganelleInteractions<{
    in: [[Impulse, Particle]];
    out: [Log];
}>;
//# sourceMappingURL=net-client.org.h.d.ts.map