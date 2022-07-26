import { domc } from "@euglena/core";
import { PLog } from "../../particle";
import { PTransmitParticle, POrganelleInfo, PTransmitResponse, PEuglenaHasBeenBorn } from "./create-organelle-module.h";

const endoplasmicReticulum = domc<
    {
        in: {
            TransmitParticle: PTransmitParticle;
            OrganelleInfo: POrganelleInfo;
        };
        out: {
            Log: PLog;
            TransmitResponse: PTransmitResponse;
            EuglenaHasBeenBorn: PEuglenaHasBeenBorn;
        };
    },
    "EndoplasmicReticulum"
>(["TransmitParticle", "OrganelleInfo"], ["EuglenaHasBeenBorn", "Log", "TransmitResponse"], "EndoplasmicReticulum");

export { endoplasmicReticulum };
