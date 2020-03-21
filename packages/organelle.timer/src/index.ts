import { CommonParticles, domc, P } from "@euglena/core";
import { sys } from "cessnalib";

export default domc("Timer")<{
    incoming: {
        ReadTime: P;
        SetTime: P<sys.type.Time>;
    };
    outgoing: {
        ACK: CommonParticles["ACK"];
        Time: P<sys.type.Time>;
    };
}>(["ReadTime", "SetTime"], ["ACK", "Time"]);
