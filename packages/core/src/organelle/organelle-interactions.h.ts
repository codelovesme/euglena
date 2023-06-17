import { Interaction } from "./interaction.h";

export type OrganelleInteractions = {
    in: Interaction[];
    out: Interaction[];
};

export type createOrganelleInteractions<I extends OrganelleInteractions> = I;

