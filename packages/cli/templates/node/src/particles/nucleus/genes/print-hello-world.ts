import {
  Dependencies,
  dg,
  EuglenaHasBeenBorn,
  logger,
  Organelles,
} from "@euglena/template";

export type PrintHelloWorldOrganelles = Organelles<{
  logger: string;
}>;

export type PrintHelloWorld = Dependencies<PrintHelloWorldOrganelles>;

export const createGene = dg<EuglenaHasBeenBorn, PrintHelloWorld>(
  "Print Hello World",
  { meta: { class: "EuglenaHasBeenBorn" } },
  async (p, s, { to }) => {
    const log = logger.v1.cp.Log({ message: "Hello World", level: "Info" });
    return await to.logger(log);
  }
);
