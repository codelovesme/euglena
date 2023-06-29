import { genetics } from "../../../../cell";
import { vacuole } from "../../store";
import { Logger } from "../../../../log/logger.org.h";
export declare const createGeneGetApi: (organelles: genetics.Stringify<{
    permanentVacuole: vacuole.Vacuole;
    temporaryVacuole: vacuole.Vacuole;
    nucleus: genetics.Nucleus;
    logger: Logger;
}>) => genetics.Gene<import("@euglena/core").Particle<string, any, {}>, genetics.Organelles>;
//# sourceMappingURL=get-api.gene.d.ts.map