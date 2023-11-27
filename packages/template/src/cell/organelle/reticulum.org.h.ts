import { createOrganelleInteractions } from "@euglena/core";
import { OrganelleInfo } from "./organelle-info.par.h";
import { EuglenaHasBeenBorn } from "../euglena-has-been-born.par.h";
import { TransmitParticle } from "./transmit-particle.par.h";
import { log } from "../../sys";
import { GetOrganelleNames } from "./get-organelle-names.par.h";
import { StringArray } from "../../text";

export type Reticulum = createOrganelleInteractions<{
    in: [
        [TransmitParticle, any],
        [GetOrganelleNames, StringArray],
        OrganelleInfo
    ];
    out: [log.Log, EuglenaHasBeenBorn];
}>;

