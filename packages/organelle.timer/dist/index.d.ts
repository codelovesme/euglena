import { P } from "@euglena/core";
import { sys } from "cessnalib";
declare const _default: import("@euglena/core").CreateOrganelleModuleInterface<"Timer", {
    incoming: {
        ReadTime: P<any, {}>;
        SetTime: P<sys.type.Time, {}>;
    };
    outgoing: {
        ACK: P<undefined, {}>;
        Time: P<sys.type.Time, {}>;
    };
}>;
export default _default;
