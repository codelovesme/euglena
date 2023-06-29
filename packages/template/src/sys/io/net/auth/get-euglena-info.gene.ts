import { Particle } from "@euglena/core";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";

export type GetEuglenaInfo = Particle<"GetEuglenaInfo">

export const createGeneGetEuglenaInfo = dcg<
    Pulse<GetEuglenaInfo>,
    {}
>(
    "Give Perimssion to some other euglena",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetEuglenaInfo" } } } },
    async (p) => {
        return p.data.sender;
    }
);
