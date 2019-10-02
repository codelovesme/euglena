import { createChromosome } from "@euglena/organelle.nucleus.js";
import logger from "@euglena/organelle.logger";

export default createChromosome((add) => {
    add("Write logs on console", { meta: { name: "Log" } }, (p, s, { t }) => {
        return t(p, logger.n);
    });
    add("Write a log says Hello World", { meta: { name: "EuglenaHasBeenBorn" } }, (p, s, { t }) => {
        return t(logger.cp.incoming.Log("Hello World", "Info"), logger.n);
    });
});
