import { sys } from "cessnalib";
import { domc } from "../../organelle/define-organelle-module-create";
import { P } from "../../organelle/particles.h";
import { CommonParticles } from "..";

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
