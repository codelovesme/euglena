import { Matter } from "./matter.par.h";
import { Read } from "./read.par.h";
import { Log } from "../../../log";
import { createOrganelleInteractions } from "@euglena/core";
export type MatterSensor = createOrganelleInteractions<{
    in: [[Read, Matter]];
    out: [Log];
}>;
//# sourceMappingURL=matter-sensor.org.h.d.ts.map