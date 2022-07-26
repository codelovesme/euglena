import { sys } from "cessnalib";
import { P, domc } from "@euglena/core";
import { CommonParticles } from "../particle";

const timer = {
    v1: domc<{
        in: {
            ReadTime: P;
            SetTime: P<sys.type.Time>;
        };
        out: {
            ACK: CommonParticles["ACK"];
            Time: P<sys.type.Time>;
        };
    }>(["ReadTime", "SetTime"], ["ACK", "Time"])
};

export { timer };
