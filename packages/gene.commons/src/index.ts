import { createChromosome, logger } from "@euglena/core";

export default createChromosome((addGene) => {
    addGene("Log", { meta: { name: "Log" } }, async (particle, source, { t }) => {
        t(logger.v1.cp.Log(particle.data), "Logger");
    });
});
