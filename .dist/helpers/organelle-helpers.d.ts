import { Reaction, CytoplasmReceive } from "../cytoplasm";
import { CreateOrganelle } from "../organelle";
export interface AddReaction {
    (particleName: string, reaction: Reaction): void;
}
export interface BindReactions {
    (addReaction: AddReaction, receive: CytoplasmReceive): void;
}
export declare function defineCreateOrganelle(bindReactions: BindReactions): CreateOrganelle;
/**
 * Aliases
 */
export declare const defO: typeof defineCreateOrganelle;
