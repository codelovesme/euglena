import { cc } from "@euglena/core";
import logger from "@euglena/organelle.logger";

export default cc((add) => {
    add("Write logs on console", { meta: { class: "Log" } }, (p, s, { t }) => {
        return t(p, logger.n);
    });
    add("Write a log says Hello World", { meta: { class: "EuglenaHasBeenBorn" } }, (p, s, { t }) => {
        return t(logger.cp.incoming.Log({ message: "Hello World", level: "Info" }), logger.n);
    });
});
