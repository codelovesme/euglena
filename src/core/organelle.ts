import { sys } from "cessnalib";
import {
  BindReactions,
  OrganelleReceive,
  OrganelleModule,
  CreateOrganelleModule,
  CreateOrganelle,
  InComingParticleUnion,
  OutGoingParticleUnion,
  CreateOrganelleParticles,
  InComingParticleNameUnion
} from "./organelle.h";
import { CytoplasmReceive, OrganelleReaction } from "./cytoplasm.h";

export const createOrganelleModule: CreateOrganelleModule = <
  OrganelleName extends string,
  COP extends CreateOrganelleParticles
>(
  name: OrganelleName,
  createParticles: COP,
  bindReactions: BindReactions<COP>
): OrganelleModule<OrganelleName, COP> => {
  const createOrganelle: CreateOrganelle<InComingParticleUnion<COP>, OutGoingParticleUnion<COP>> = (
    receive: CytoplasmReceive
  ): OrganelleReceive<InComingParticleUnion<COP>, OutGoingParticleUnion<COP>> => {
    const reactions = new sys.type.Map<
      InComingParticleNameUnion<COP>,
      OrganelleReaction<COP, InComingParticleNameUnion<COP>>
    >();
    bindReactions((particleName, action) => {
      reactions.add(particleName, action);
    });
    return particle => {
      let reaction = reactions.get(particle.meta.name);
      if (reaction) {
        const r = receive.bind(undefined, name);
        return reaction(particle, {
          receive: r,
          r,
          createParticle: createParticles["outgoing"],
          cp: createParticles["outgoing"]
        });
      } else {
        throw `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`;
      }
    };
  };
  return {
    name,
    /**
     * Alias for name
     */
    n: name,
    createParticles,
    /**
     * Alias for createParticles
     */
    cp: createParticles,
    createOrganelle,
    /**
     * Alias for createOrganelle
     */
    co: createOrganelle
  };
};

/**
 * Alias for createOranelleModule
 */
export const com = createOrganelleModule;
