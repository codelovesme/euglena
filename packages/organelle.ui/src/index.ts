import { domc, P, FromP, PACK, PException, PLog } from "@euglena/core";

type PEvent = P;
type PRender = P;

export type Event = FromP<"Event", PEvent>;

export default domc("UI")<{
    incoming: {
        Render: PRender;
    };
    outgoing: {
        ACK: PACK;
        Exception: PException;
        Log: PLog;
        Event: PEvent;
    };
}>(["Render"], ["ACK", "Exception", "Log", "Event"]);
