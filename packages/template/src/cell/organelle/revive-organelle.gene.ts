import { cp, isParticleClass } from "@euglena/core";
import { log } from "../../sys";
import { Nucleus, dcg } from "../genetics"
import { GetAlive } from "./get-alive.par.h";
import { ACK, Exception } from "../../type";
import { ReviveOrganelle } from "./revive-organelle.par.h"

export default dcg<
    ReviveOrganelle,
    {
        nucleus: Nucleus;
        logger: log.Logger;
    }
>("ReviveOrganelle", { meta: { class: "ReviveOrganelle" } }, async (p, s, { t, o }) => {
    const getAlive = cp<GetAlive>("GetAlive");
    const x = (await t(getAlive as any, p.data.organelleName as any)) as unknown as ACK | Exception;
    if (isParticleClass(x, "Exception")) {
        let counter = 0;
        if (p.data.retryCount > counter) {
            const interval = setInterval(async () => {
                const resp = (await t(getAlive as any, p.data.organelleName as any)) as unknown as ACK | Exception;
                if (isParticleClass(resp, "Exception")) {
                    t(
                        cp<log.Log>("Log", {
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
