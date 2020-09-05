import { sys } from "cessnalib";
import { P } from "../particles.h";
declare const timer: {
    v1: import("..").CreateOrganelleModuleInterface<{
        incoming: {
            ReadTime: P<any, {}>;
            SetTime: P<sys.type.Time, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Time: P<sys.type.Time, {}>;
        };
    }, undefined>;
};
export { timer };
