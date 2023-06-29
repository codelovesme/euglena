import { Particle } from "@euglena/core";
import { EuglenaInfo } from "./auth/euglena-info.par.h";
export type Pulse<P extends Particle = Particle> = Particle<"Pulse", {
    particle: P;
    sender?: EuglenaInfo;
}>;
//# sourceMappingURL=pulse.par.h.d.ts.map