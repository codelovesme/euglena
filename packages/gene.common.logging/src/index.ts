import "@euglena/core";
import { dcg } from "@euglena/organelle.nucleus.js";
import { particle, organelle } from "@euglena/template";

export default dcg<
    particle.common.Log,
    {
        logger: organelle.logger.Logger;
    } 
>("Log", { meta: { class: "Log" } }, async (p, s, { t }) => {
    return await t(p, "logger");
});
