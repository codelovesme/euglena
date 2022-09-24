import { createParticle, Particle } from "@euglena/core";
import { Organelles, Dependencies, Parameters } from "../../gene.h";
import { dg } from "../../gene";
import { ReceiveParticle } from "../../create-organelle-module.h";
import { Exception, GetAlive } from "../../../../particle.h";
import { nucleus, vacuole } from "../../..";

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

export const createGene = dg<
    VacuoleGetAlive,
    VacuoleGetAliveDependencies,
    { vacuole: vacuole.Vacuole; nucleus: nucleus.Nucleus }
>(
    "Vacuole Get Alive",
    { meta: { class: "VacuoleGetAlive" } },
    async (p, s, { t, o, params: { retry, retryInterval = 10000 } }) => {
        const getAlive = createParticle<GetAlive>("GetAlive");
        const x = await t(getAlive, "vacuole");
        if ((x as Exception).meta.class === "Exception") {
            if (retry) {
                setTimeout(() => {
                    t(
                        createParticle<ReceiveParticle>("ReceiveParticle", {
                            particle: { meta: { class: "VacuoleGetAlive" }, data: null },
                            source: o.nucleus
                        }),
                        "nucleus"
                    );
                }, retryInterval);
            }
        }
    }
);
