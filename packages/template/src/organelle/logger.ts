import { ACK, AllInteractions, Log } from "@euglena/core";

export type Logger = AllInteractions<{
    in: [Log];
    out: [ACK];
}>;
