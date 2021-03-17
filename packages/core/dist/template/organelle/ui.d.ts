import { P, FromP } from "../../organelle/particles.h";
import { PACK, PLog, PException } from "..";
declare type PEvent = P;
declare type PRender = P;
export declare type Event = FromP<"Event", PEvent>;
declare const ui: {
    v1: import("../..").CreateOrganelleModuleInterface<{
        incoming: {
            Render: PRender;
        };
        outgoing: {
            ACK: PACK;
            Exception: PException;
            Log: PLog;
            Event: PEvent;
        };
    }, undefined>;
};
export { ui };
