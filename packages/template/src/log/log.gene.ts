import { dcg } from "../cell/genetics/gene.u";
import { Log } from "./log.par.h";
import { Logger } from "./logger.org.h";

export const createGeneLog = dcg<
    Log,
    {
        logger: Logger;
    }
>("Log", { meta: { class: "Log" } }, async (p, s, { t }) => {
    return await t(p, "logger");
});
