import { P } from "@euglena/core";
import { sys } from "cessnalib";
declare const timer: {
    v1: import("@euglena/core").CreateOrganelleModuleInterface<{
        incoming: {
            ReadTime: P<any, {}>;
            SetTime: P<sys.type.Time, {}>;
        };
        outgoing: {
            ACK: P<undefined, {}>;
            Time: P<sys.type.Time, {}>;
        };
    }>;
};
export { timer };
