import { CreateOrganelle } from "./organelle.h";
import { Chromosome } from "./gene.h";

export interface CreateEuglena {
  (createOrganelles: { [organelleName: string]: CreateOrganelle }, geneCluster: Chromosome): void;
}
