import { P, FromP } from "../particles.h";
import { domc } from "../define-organelle-module-create";
import { PACK, PLog, PException } from "../../common";

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
