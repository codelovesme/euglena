import { cc, logger } from "@euglena/core";
import { LoggerName } from "./constants";

export default cc((add) => {
    add("Write logs on console", { meta: { class: "Log" } }, (p, s, { t }) => {
        return t(p, LoggerName);
    });
    add("Write a log says Hello World", { meta: { class: "EuglenaHasBeenBorn" } }, (p, s, { t }) => {
        return t(logger.v1.cp.Log({ message: "Hello World", level: "Info" }), LoggerName);
    });
});
