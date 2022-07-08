import { sys } from "cessnalib";
import { P, domc } from "@euglena/core";
import { CommonParticles } from "../particle";

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
