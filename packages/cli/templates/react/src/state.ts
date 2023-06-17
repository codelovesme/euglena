import { Particle } from "@euglena/core";
import { sys } from "cessnalib";

export type State = Particle<
    "State",
    {
        title: string;
        time: sys.Time;
    } | undefined
>;
