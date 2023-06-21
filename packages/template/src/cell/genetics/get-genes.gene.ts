import { cp } from "@euglena/core";
import { dcg } from "./gene.u";
import { Pulse } from "../../sys/io/net/pulse.par.h";
import { GetGenes } from "./get-genes.par.h";
import { Nucleus } from "./nucleus.org.h";

export const createGeneGetGenes = dcg<
    Pulse<GetGenes>,
    {
        nucleus: Nucleus
    }
>(
    "Get genes",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetGenes" } } } },
    async (p, s, { t, o }) => {
        return await t(cp<GetGenes>("GetGenes"), "nucleus");
    }
);
