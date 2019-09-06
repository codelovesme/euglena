import { MetaAdditions, Particle, Meta } from "../core/particle.h";
import { CreateCommonParticles, Count, OrganelleInfoLocationType } from "./common-particles.h";
import { sys } from "cessnalib";
import { cp } from "../core/particle";

export const createCommonParticle: CreateCommonParticles = {
  ACK: (adds?: MetaAdditions) => cp("ACK", undefined, adds),
  EuglenaHasBeenBorn: (adds?: MetaAdditions) => cp("EuglenaHasBeenBorn", undefined, adds),
  EuglenaName: (name: string, adds?: MetaAdditions) => cp("EuglenaName", name, adds),
  Exception: (message: string, innerException?: sys.type.Exception, adds?: MetaAdditions) =>
    cp("Exception", new sys.type.Exception(message, innerException), adds),
  Particles: (particlesArray: Particle[], adds?: MetaAdditions) => cp("Particles", particlesArray, adds),
  Metas: (metas: Meta[], adds?: MetaAdditions) => cp("Metas", metas, adds),
  NoReaction: (adds?: MetaAdditions) => cp("NoReaction", undefined, adds),
  OrganelleInfo: (
    organelleName: string,
    location: {
      type: OrganelleInfoLocationType;
      path: string;
    },
    adds?: MetaAdditions
  ) => cp("OrganelleInfo", { name: organelleName, location: location }, adds),
  SaveParticle: (
    particle: Particle,
    query?: sys.type.RecursivePartial<Particle>,
    count: Count = 1,
    adds?: MetaAdditions
  ) => cp("SaveParticle", { particle, query, count }, adds),
  ReadParticle: (query: sys.type.RecursivePartial<Particle>, count: Count = 1, adds?: MetaAdditions) =>
    cp("ReadParticle", { query, count }, adds),
  RemoveParticle: (query: sys.type.RecursivePartial<Particle>, count: Count = 1, adds?: MetaAdditions) =>
    cp("RemoveParticle", { query, count }, adds),
  InvalidParticle: (adds?: MetaAdditions) => cp("InvalidParticle", adds)
};

/**
 * Alias for createCommonParticle
 */
export const ccp = createCommonParticle;
