import { domc } from "..";
import { PLog } from "../..";
import { PTransmitParticle, POrganelleInfo, PTransmitResponse, PEuglenaHasBeenBorn } from "./create-organelle-module.h";

const endoplasmicReticulum = domc<
    {
        incoming: {
            TransmitParticle: PTransmitParticle;
            OrganelleInfo: POrganelleInfo;
        };
        outgoing: {
            Log: PLog;
            TransmitResponse: PTransmitResponse;
            EuglenaHasBeenBorn: PEuglenaHasBeenBorn;
        };
    },
    "EndoplasmicReticulum"
>(["TransmitParticle", "OrganelleInfo"], ["EuglenaHasBeenBorn", "Log", "TransmitResponse"], "EndoplasmicReticulum");

export { endoplasmicReticulum };
