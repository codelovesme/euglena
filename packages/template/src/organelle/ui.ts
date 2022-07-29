import { AllInteractions, ACK, Particle, Log } from "@euglena/core";

export type Event = Particle<"Event">;
export type Render = Particle<"Render">;

export type UI = AllInteractions<{
    in: [[Render, ACK]];
    out: [Log, Event];
}>;