import { FromP, P, domc } from "@euglena/core";
import { PACK, PException, PLog } from "../particle/particles.h";

export type PEvent = P;
export type PRender = P;
export type Event = FromP<"Event", PEvent>;
export type Render = FromP<"Render", PRender>;

const ui = {
    v1: domc<{
        incoming: {
            Render: PRender;
        };
        outgoing: {
            ACK: PACK;
            Exception: PException;
            Log: PLog;
            Event: PEvent;
        };
    }>(["Render"], ["ACK", "Exception", "Log", "Event"])
};

export { ui };
