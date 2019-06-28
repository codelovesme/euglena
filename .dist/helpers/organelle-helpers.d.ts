import { OrganelleReaction } from "../cytoplasm";
import { CreateOrganelle } from "../organelle";
export interface AddReaction {
    (particleName: string, reaction: OrganelleReaction): void;
}
export interface BindReactions {
    (addReaction: AddReaction): void;
}
export declare function defineCreateOrganelle(organelleName: string, bindReactions: BindReactions): CreateOrganelle;
/**
 * Aliases
 */
export declare const defO: typeof defineCreateOrganelle;
