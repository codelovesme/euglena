import { PLog } from "../../..";
import { PTransmitParticle, POrganelleInfo, PTransmitResponse, PEuglenaHasBeenBorn } from "./create-organelle-module.h";
declare const endoplasmicReticulum: import("../../..").CreateOrganelleModuleInterface<{
    incoming: {
        TransmitParticle: PTransmitParticle;
        OrganelleInfo: POrganelleInfo;
    };
    outgoing: {
        Log: PLog;
        TransmitResponse: PTransmitResponse;
        EuglenaHasBeenBorn: PEuglenaHasBeenBorn;
    };
}, "EndoplasmicReticulum">;
export { endoplasmicReticulum };
