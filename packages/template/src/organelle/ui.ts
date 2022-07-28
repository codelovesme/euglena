import { AllInteractions, ACK, Particle } from "@euglena/core";
import { Log } from "../particle/particles.h";

export type Event = Particle<"Event">;
export type Render = Particle<"Render">;

export type UI = AllInteractions<{
    in: [[Render, ACK]];
    out: [[Log], [Event]];
}>;