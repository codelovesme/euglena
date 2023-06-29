import { createOrganelleInteractions } from "@euglena/core";
import { AddRoute } from "./add-route.par.h";
import { HttpImpulse } from "./http-impulse.par.h";
import { organelle } from "../../../../cell";
import { Log } from "../../../../log";
import { Particles } from "../../../../particles.par.h";
export type HttpServer = createOrganelleInteractions<{
    in: [organelle.GetAlive, AddRoute];
    out: [[HttpImpulse, Particles], Log];
}>;
//# sourceMappingURL=http-server.org.h.d.ts.map