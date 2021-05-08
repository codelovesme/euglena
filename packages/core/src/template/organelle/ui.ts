import { P, FromP } from "../../organelle/particles.h";
import { domc } from "../../organelle/define-organelle-module-create";
import { PACK, PLog, PException } from "..";

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
