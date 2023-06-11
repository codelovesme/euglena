import { createOrganelleInteractions } from "@euglena/core";
import { OrganelleInfo } from "./organelle-info.par.h";
import { EuglenaHasBeenBorn } from "../euglena-has-been-born.par.h";
import { TransmitParticle } from "./transmit-particle.par.h";
import { log } from "../../sys";

export type Reticulum = createOrganelleInteractions<{
    in: [[TransmitParticle, any], OrganelleInfo];
    out: [log.Log, EuglenaHasBeenBorn];
}>;

