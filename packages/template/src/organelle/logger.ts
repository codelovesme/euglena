import { AllInteractions } from "@euglena/core";
import { ACK, Log } from "../particle/common.h";

export type Logger = AllInteractions<{
    in: [[Log, ACK]];
    out: [];
}>;
