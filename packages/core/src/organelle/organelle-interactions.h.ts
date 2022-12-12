import { Interaction } from "./interaction.h";

export type OrganelleInteractions = {
    in: Interaction[];
    out: Interaction[];
};

export type extendOrganelleInteractions<I extends OrganelleInteractions> = I;

