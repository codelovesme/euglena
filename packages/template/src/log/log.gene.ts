import { genetics } from "../cell"
import { Log } from "./log.par.h";
import { Logger } from "./logger.org.h";

export const createGeneLog = genetics.dcg<
    Log,
    {
        logger: Logger;
    }
>("Log", { meta: { class: "Log" } }, async (p, s, { t }) => {
    return await t(p, "logger");
});
