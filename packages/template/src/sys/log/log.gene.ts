import "@euglena/core";
import { dcg } from "@euglena/organelle.nucleus.js";
import { Log } from "./log.particle.h";
import { Logger } from "./logger.organelle";

export default dcg<
    Log,
    {
        logger: Logger;
    }
>("Log", { meta: { class: "Log" } }, async (p, s, { t }) => {
    return await t(p, "logger");
});
