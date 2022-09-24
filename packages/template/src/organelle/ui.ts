import { AllInteractions, Particle } from "@euglena/core";
import { ACK, Exception, Log } from "../particle";

export type Event = Particle<"Event">;
export type Render = Particle<"Render">;

export type UI = AllInteractions<{
    in: [[Render, ACK | Exception]];
    out: [Log, Event];
}>;
