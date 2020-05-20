import { domc, P, FromP, PACK, PException, PLog } from "@euglena/core";

type PEvent = P;
type PRender = P;

export type Event = FromP<"Event", PEvent>;

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
