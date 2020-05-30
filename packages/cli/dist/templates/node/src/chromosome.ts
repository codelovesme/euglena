import { cc, logger } from "@euglena/core";
import { LoggerName } from "./particles";

const {
    cp: { incoming: cpLogger }
} = logger.v1;

export default cc((add) => {
    add("Write logs on console", { meta: { class: "Log" } }, (p, s, { t }) => {
        return t(p, LoggerName);
    });
    add("Write a log says Hello World", { meta: { class: "EuglenaHasBeenBorn" } }, (p, s, { t }) => {
        return t(cpLogger.Log({ message: "Hello World", level: "Info" }), LoggerName);
    });
});
