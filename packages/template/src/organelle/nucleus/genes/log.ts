import { dg, Dependencies, Parameters, Organelles } from "../../../organelle/nucleus";
import { Log } from "../../../particle";

export type LogOrganelles = Organelles<{
    logger: string;
}>;

export type LogParameters = Parameters<{}>;

export type LogDependencies = Dependencies<LogOrganelles, LogParameters>;

export const createGene = dg<Log, LogDependencies>(
    "Send log particles to logger",
    { meta: { class: "Log" } },
    async (p, s, { to }) => {
        return await to.logger(p);
    }
);
