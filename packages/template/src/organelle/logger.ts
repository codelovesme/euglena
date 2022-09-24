import { AllInteractions } from "@euglena/core";
import { ACK, Log } from "../particle";

export type Logger = AllInteractions<{
    in: [[Log, ACK]];
    out: [];
}>;
