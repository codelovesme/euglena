import { Particle } from "@euglena/core";
import { Exception } from "../../../../particle";
import { Organelles, Dependencies, Parameters } from "../../gene.h";
import { dg } from "../../gene";

export type VacuoleGetAlive = Particle<"VacuoleGetAlive">;

export type VacuoleGetAliveOrganelles = Organelles<{
    vacuole: string;
    nucleus: string;
}>;

export type VacuoleGetAliveParameters = Parameters<{
    retryInterval?: number;
    retry: boolean;
}>;
export type VacuoleGetAliveDependencies = Dependencies<VacuoleGetAliveOrganelles, VacuoleGetAliveParameters>;

export const createGene = dg<VacuoleGetAlive, VacuoleGetAliveDependencies>(
    "Vacuole Get Alive",
    { meta: { class: "VacuoleGetAlive" } },
    async (p, s, { to, o, params: { retry, retryInterval = 10000 }, template }) => {
        const { vacuole, nucleus } = template;
        const getAlive = vacuole.v1.cp.GetAlive();
        const x = await to.vacuole(getAlive);
        if ((x as Exception).meta.class === "Exception") {
            if (retry) {
                setTimeout(() => {
                    to.nucleus(
                        nucleus.cp.ReceiveParticle({
                            particle: { meta: { class: "VacuoleGetAlive" }, data: null },
                            source: o.nucleus
                        })
                    );
                }, retryInterval);
            }
        }
    }
);
