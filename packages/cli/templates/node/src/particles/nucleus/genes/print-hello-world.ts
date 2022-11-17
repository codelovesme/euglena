import { cp, Log } from "@euglena/core";
import { nucleus, endoplasmicReticulum, logger } from "@euglena/template";

export type PrintHelloWorldOrganelles = nucleus.Organelles<{
    logger: { name: string; allInteractions: logger.Logger };
}>;

export type PrintHelloWorld = nucleus.Dependencies<PrintHelloWorldOrganelles>;

export const createGene = nucleus.dg<endoplasmicReticulum.EuglenaHasBeenBorn, PrintHelloWorld>(
    "Print Hello World",
    { meta: { class: "EuglenaHasBeenBorn" } },
    async (p, s, { to }) => {
        const log = cp<Log>("Log", { message: "Hello World", level: "Info" });
        return await to("logger",log);
    }
);
