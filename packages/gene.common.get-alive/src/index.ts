import { createParticle } from "@euglena/core";
import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";
import { organelle, particle } from "@euglena/template";

import nucleus = organelle.nucleus;
import common = particle.common;

export default dcg<
    common.GetAlive,
    Organelles<{
        [x: string]: any;
        nucleus: nucleus.Nucleus;
    }>,
    Parameters<{
        retryInterval?: number;
        retry: boolean;
        organelleName: string;
    }>
>(
    "Get Alive",
    { meta: { class: "GetAlive" } },
    async (p, s, { t, o, params: { retry, retryInterval = 10000, organelleName } }) => {
        const getAlive = createParticle<common.GetAlive>("GetAlive");
        const x = await t(getAlive, organelleName);
        if ((x as common.Exception).meta.class === "Exception") {
            if (retry) {
                setTimeout(() => {
                    t(
                        nucleus.cp("ReceiveParticle", {
                            particle: { meta: { class: "GetAlive" }, data: null },
                            source: o.nucleus
                        }),
                        "nucleus"
                    );
                }, retryInterval);
            }
        }
    }
);
