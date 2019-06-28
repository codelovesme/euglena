import { OrganelleReceive, CreateOrganelle } from "../../organelle";
import { Particle } from "../../particle";
import { Chromosome, GeneCluster } from "../../gene";
export interface Cytoplasm {
    organelles: {
        [organelleName: string]: OrganelleReceive;
    };
    chromosome: Chromosome;
}
export declare function createEuglena(createOrganelles: {
    [organelleName: string]: CreateOrganelle;
}, geneCluster: GeneCluster, particles: Particle[]): void;
