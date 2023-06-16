import { cp } from "@euglena/core";
import { cell, log } from "@euglena/template";

export default cell.genetics.dcg<cell.EuglenaHasBeenBorn, { logger: log.Logger }>(
    "Print Hello World",
    { meta: { class: "EuglenaHasBeenBorn" } },
    async (p, s, { t }) => {
        const log = cp<log.Log>("Log", { message: "Hello World", level: "Info" });
        return await t(log, "logger");
    }
);
