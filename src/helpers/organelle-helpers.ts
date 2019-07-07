import { Particle } from "../particle";
import { sys } from "cessnalib";
import { OrganelleReaction, CytoplasmReceive } from "../cytoplasm";
import { CreateOrganelle, OrganelleReceive } from "../organelle";
import { isParticleV1, isParticleV2, isParticleV3, assertNotParticle } from "./particle-helpers";

export interface AddReaction {
  (particleName: string, reaction: OrganelleReaction): void;
}

export interface BindReactions {
  (addReaction: AddReaction): void;
}

export function defineCreateOrganelle(organelleName: string, bindReactions: BindReactions): CreateOrganelle {
  return (receive: CytoplasmReceive): OrganelleReceive => {
    const reactions = new sys.type.Map<string, OrganelleReaction>();
    bindReactions((particleName: string, action: OrganelleReaction) => {
      reactions.add(particleName, action);
    });
    return (particle: Particle): Promise<Particle | void> => {
      let reaction = reactions.get(particle.meta.name);
      if (reaction)
        return reaction(particle, {
          receive: (particle: Particle) => {
            if (isParticleV3(particle)) {
              return receive(
                {
                  ...particle,
                  meta: { ...particle.meta }
                },
                organelleName
              );
            } else if (isParticleV2(particle) || isParticleV1(particle)) {
              return receive(
                {
                  ...particle,
                  meta: { ...particle.meta }
                },
                organelleName
              );
            } else {
              assertNotParticle(particle, `Unknown Particle Version - While creating ${organelleName} particle`);
            }
          }
        });
    };
  };
}

/**
 * Aliases
 */
export const defO = defineCreateOrganelle;
