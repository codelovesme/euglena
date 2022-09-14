import { createParticle, Exception, Particle } from "@euglena/core";
import { Organelles, Dependencies, Parameters } from "../../gene.h";
import { dg } from "../../gene";
import { GetAlive } from "../../../../utils/particles";
import { ReceiveParticle } from "../../create-organelle-module.h";

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
    async (p, s, { to, o, params: { retry, retryInterval = 10000 } }) => {
        const getAlive = createParticle<GetAlive>("GetAlive");
        const x = await to.vacuole(getAlive);
        if ((x as Exception).meta.class === "Exception") {
            if (retry) {
                setTimeout(() => {
                    to.nucleus(
                        createParticle<ReceiveParticle>("ReceiveParticle", {
                            particle: { meta: { class: "VacuoleGetAlive" }, data: null },
                            source: o.nucleus
                        })
                    );
                }, retryInterval);
            }
        }
    }
);
