import { CommonParticles, domc, P } from "@euglena/core";
import { sys } from "cessnalib";

const timer = {
    v1: domc<{
        incoming: {
            ReadTime: P;
            SetTime: P<sys.type.Time>;
        };
        outgoing: {
            ACK: CommonParticles["ACK"];
            Time: P<sys.type.Time>;
        };
    }>(["ReadTime", "SetTime"], ["ACK", "Time"])
};

export { timer };
