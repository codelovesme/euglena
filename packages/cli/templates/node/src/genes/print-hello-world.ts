import { particle, organelle } from "@euglena/template";
import { dcg } from "@euglena/organelle.nucleus.js";

import logger = organelle.logger;
import EuglenaHasBeenBorn = organelle.endoplasmicReticulum.EuglenaHasBeenBorn;

export default dcg<EuglenaHasBeenBorn, { logger: logger.Logger }>(
    "Print Hello World",
    { meta: { class: "EuglenaHasBeenBorn" } },
    async (p, s, { t }) => {
        const log = particle.common.cp("Log", { message: "Hello World", level: "Info" });
        return await t(log, "logger");
    }
);