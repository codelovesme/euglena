import { cp, MetaAdditions } from "@euglena/particle";
import { domc } from "@euglena/organelle";
import { ccp } from "@euglena/common";
import { sys } from "cessnalib";

export default domc("Timer", {
    incoming: {
        ReadTime: (adds?: MetaAdditions) => cp("ReadTime", undefined, adds),
        SetTime: (time: sys.type.Time, adds?: MetaAdditions) => cp("SetTime", time, adds)
    },
    outgoing: {
        Time: (time: sys.type.Time, adds?: MetaAdditions) => cp("Time", time, adds),
        ACK: ccp["ACK"]
    }
});
