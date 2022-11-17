import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";
import { particle, organelle } from "@euglena/template";

export default dcg<
    particle.common.Log,
    Organelles<{
        logger: organelle.logger.Logger;
    }>,
    Parameters<{}>
>("Log", { meta: { class: "Log" } }, async (p, s, { t }) => {
    return await t(p, "logger");
});
