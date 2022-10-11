import { createParticle, Particle } from "@euglena/core";
import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";
import { organelle, particle } from "@euglena/template";

import nucleus = organelle.nucleus;
import vacuole = organelle.vacuole;
import common = particle.common;

export type VacuoleGetAlive = Particle<"VacuoleGetAlive">;

export default dcg<
    VacuoleGetAlive,
    Organelles<{
        vacuole: vacuole.Vacuole;
        nucleus: nucleus.Nucleus;
    }>,
    Parameters<{
        retryInterval?: number;
        retry: boolean;
    }>
>(
    "Vacuole Get Alive",
    { meta: { class: "VacuoleGetAlive" } },
    async (p, s, { t, o, params: { retry, retryInterval = 10000 } }) => {
        const getAlive = createParticle<common.GetAlive>("GetAlive");
        const x = await t(getAlive, "vacuole");
        if ((x as common.Exception).meta.class === "Exception") {
            if (retry) {
                setTimeout(() => {
                    t(
                        nucleus.cp("ReceiveParticle", {
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
