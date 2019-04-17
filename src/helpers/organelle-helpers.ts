import { Particle } from "../particle";
import { sys } from "cessnalib";
import { Reaction, CytoplasmReceive } from "../cytoplasm";
import { CreateOrganelle, OrganelleReceive } from "../organelle";

export interface AddReaction {
  (particleName: string, reaction: Reaction): void;
}

export interface BindReactions {
  (addReaction: AddReaction, receive: CytoplasmReceive): void;
}

export function defineCreateOrganelle(bindReactions: BindReactions): CreateOrganelle {
  return (cytoplasmReceive: CytoplasmReceive): OrganelleReceive => {
    const reactions = new sys.type.Map<string, Reaction>();
    bindReactions((particleName: string, action: Reaction) => {
      reactions.add(particleName, action);
    }, cytoplasmReceive);
    return (particle: Particle): Promise<Particle | void> => {
      let reaction = reactions.get(particle.meta.name);
      if (reaction) return reaction(particle);
    };
  };
}

/**
 * Aliases
 */
export const defO = defineCreateOrganelle;
