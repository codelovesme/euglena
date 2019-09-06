import { CreateCytoplasmParticles } from "./cytoplasm.h";
import { MetaAdditions } from "./particle.h";
import { cp } from "./particle";

export const createCytoplasmParticles: CreateCytoplasmParticles = {
  EuglenaHasBeenBorn: (adds?: MetaAdditions) => cp("EuglenaHasBeenBorn", undefined, adds)
};

/**
 * Alias for createCytoplasmParticles
 */
export const ccyp = createCytoplasmParticles;
