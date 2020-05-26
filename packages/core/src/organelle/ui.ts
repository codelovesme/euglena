import { P, FromP } from "./organelle.h";
import { domc } from "./organelle";
import { PACK, PLog, PException } from "../common";

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
