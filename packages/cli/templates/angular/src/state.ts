import { sys } from "cessnalib";
import { particle } from "@euglena/core";

export type State = particle.Particle<
    "State",
    {
        title: string;
        time: sys.type.Time;
    } | undefined
>;
