import { Log } from "@euglena/core";
import { dg } from "../../gene";
import { Dependencies, Organelles, Parameters } from "../../gene.h";

export type LogOrganelles = Organelles<{
    logger: string;
}>;

export type LogParameters = Parameters<{}>;
export type LogDependencies = Dependencies<LogOrganelles, LogParameters>;

export const createGene = dg<Log, LogDependencies>(
    "Log",
    { meta: { class: "Log" } },
    async (p, s, { t }) => {
        return await t(p,"logger");
    }
);
