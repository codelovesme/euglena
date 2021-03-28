import { cc, Log, logger } from "@euglena/core";

export default cc((g) => {
    g("Log", { meta: { class: "Log" } }, async (particle: Log, source, { t }) => {
        t(logger.v1.cp.Log(particle.data), "Logger");
    });
});
