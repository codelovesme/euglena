import { createOrganelleInteractions } from "@euglena/core";
import { Package } from "./package.par.h";
import { GetPackage } from "./get-package.par.h";
export type LibOrganelle = createOrganelleInteractions<{
    in: [[GetPackage, Package]];
    out: [];
}>;
//# sourceMappingURL=lib.org.h.d.ts.map