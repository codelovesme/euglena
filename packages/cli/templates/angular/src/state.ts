import { sys } from "cessnalib";
import { Particle } from "@euglena/core";

export type State = Particle<
    "State",
    {
        title: string;
        time: type.Time;
    } | undefined
>;
