import * as core from "@euglena/core";
import { dcg } from "@euglena/organelle.nucleus.js";
import { organelle, particle } from "@euglena/template";

import nucleus = organelle.nucleus;
import logger = organelle.logger;
import common = particle.common;

import ACK = common.ACK;
import Exception = common.Exception;
import ReviveOrganelle = common.ReviveOrganelle;

const isParticleClass = core.particle.isParticleClass;

export default dcg<
    ReviveOrganelle,
    {
        nucleus: nucleus.Nucleus;
        logger: logger.Logger;
    }
>("ReviveOrganelle", { meta: { class: "ReviveOrganelle" } }, async (p, s, { t, o }) => {
    const getAlive = particle.common.cp("GetAlive");
    const x = (await t(getAlive as any, p.data.organelleName as any)) as unknown as ACK | Exception;
    if (isParticleClass(x, "Exception")) {
        let counter = 0;
        if (p.data.retryCount > counter) {
            const interval = setInterval(async () => {
                const resp = (await t(getAlive as any, p.data.organelleName as any)) as unknown as ACK | Exception;
                if (isParticleClass(resp, "Exception")) {
                    t(
                        particle.common.cp("Log", {
                            message: `The organelle ${p.data.organelleName} couldn't get alive`,
                            level: "Info"
                        }),
                        "logger"
                    );
                } else {
                    clearInterval(interval);
                }
            }, p.data.retryInterval);
        }
    }
});
