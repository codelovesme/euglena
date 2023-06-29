import { vacuole } from "../../store";
import { Encryptor } from "../../../crypt";
import { Logger } from "../../../../log/logger.org.h";
import { Nucleus } from "../../../../cell/genetics/nucleus.org.h";
/**
 * Checks authorization / permissions
 * then creates a pulse from impulse
 */
export declare const createGeneHandleImpulse: (organelles: import("../../../../cell/genetics").Stringify<{
    logger: Logger;
    jwt: Encryptor;
    permanentVacuole: vacuole.Vacuole;
    temporaryVacuole: vacuole.Vacuole;
    nucleus: Nucleus;
}>) => import("../../../../cell/genetics").Gene<import("@euglena/core").Particle<string, any, {}>, import("../../../../cell/genetics").Organelles>;
//# sourceMappingURL=handle-impulse.gene.d.ts.map