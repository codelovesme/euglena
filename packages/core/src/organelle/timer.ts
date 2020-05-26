import { sys } from "cessnalib";
import { domc } from "./organelle";
import { P } from "./organelle.h";
import { CommonParticles } from "../common";

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
