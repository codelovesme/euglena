import { sys } from "cessnalib";
import { P } from "../particles.h";
import { CommonParticles } from "../../common";
declare const timer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            ReadTime: P;
            SetTime: P<sys.type.Time>;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Time: P<sys.type.Time>;
        };
    }, undefined>;
};
export { timer };
