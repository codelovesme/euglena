import { ComingParticleUnion, GoingParticleUnion, createOrganelleInteractions } from "@euglena/core";
import { Impulse } from "./impulse.par.h";
import { Log } from "../../../../log";
import { organelle } from "../../../../cell";
import { Particles } from "../../../../particles.par.h";
export type NetServer = createOrganelleInteractions<{
    in: [organelle.GetAlive];
    out: [[Impulse, Particles], Log];
}>;
export type NetServerComingParticle = ComingParticleUnion<NetServer>;
export type NetServerGoingParticle = GoingParticleUnion<NetServer>;
//# sourceMappingURL=net-server.org.h.d.ts.map