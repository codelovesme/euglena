import { OrganelleReceive, CreateOrganelle } from "../../organelle";
import { Particle } from "../../particle";
import { CreateGeneCluster, Chromosome } from "../../gene";
export interface Cytoplasm {
    organelles: {
        [organelleName: string]: OrganelleReceive;
    };
    chromosome: Chromosome;
}
export declare function createEuglena(createOrganelles: {
    [organelleName: string]: CreateOrganelle;
}, createGeneClusterArr: CreateGeneCluster[], particles: Particle[]): void;
