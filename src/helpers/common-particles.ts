import { ParticleV3, Particle, Meta, MetaV3Optionals } from "..";
import { sys } from "cessnalib";
import { createParticle, createMetaV3 } from ".";

export enum OrganelleInfoLocationType {
  FileSystemPath,
  NodeModules,
  Url
}

export interface OrganelleInfoLocation {
  type: OrganelleInfoLocationType;
  path: string;
}

export namespace commonParticles {
  export const EuglenaName: "EuglenaName" = "EuglenaName";
  export type EuglenaName = ParticleV3<typeof EuglenaName, string>;

  export const ACK: "ACK" = "ACK";
  export type ACK = ParticleV3<typeof ACK, true>;

  export const Exception: "Exception" = "Exception";
  export type Exception = ParticleV3<typeof Exception, sys.type.Exception>;

  export const Particles: "Particles" = "Particles";
  export type Particles = ParticleV3<typeof Particles, Particle[]>;

  export const Metas: "Metas" = "Metas";
  export type Metas = ParticleV3<typeof Metas, Meta[]>;

  export const NoReaction: "NoReaction" = "NoReaction";
  export type NoReaction = ParticleV3<typeof NoReaction, undefined>;

  export const OrganelleInfo: "OrganelleInfo" = "OrganelleInfo";
  export type OrganelleInfo = ParticleV3<
    typeof OrganelleInfo,
    {
      name: string;
      location: { type: OrganelleInfoLocationType; path: string };
    }
  >;

  export const EuglenaHasBeenBorn: "EuglenaHasBeenBorn" = "EuglenaHasBeenBorn";
  export type EuglenaHasBeenBorn = ParticleV3<typeof EuglenaHasBeenBorn>;
}

export type CommonParticles =
  | commonParticles.ACK
  | commonParticles.EuglenaName
  | commonParticles.Exception
  | commonParticles.Particles
  | commonParticles.Metas
  | commonParticles.NoReaction
  | commonParticles.OrganelleInfo;

export function createCommonParticle(name: typeof commonParticles.EuglenaName, optionals?: MetaV3Optionals): commonParticles.EuglenaName;
export function createCommonParticle(name: typeof commonParticles.ACK, optionals?: MetaV3Optionals): commonParticles.ACK;
export function createCommonParticle(
  name: typeof commonParticles.Exception,
  message: string,
  innerException?: sys.type.Exception,
  optionals?: MetaV3Optionals
): commonParticles.Exception;
export function createCommonParticle(name: typeof commonParticles.Particles, particlesArray: Particle[], optionals?: MetaV3Optionals): commonParticles.Particles;
export function createCommonParticle(name: typeof commonParticles.Metas, metas: Meta[], optionals?: MetaV3Optionals): commonParticles.Metas;
export function createCommonParticle(name: typeof commonParticles.NoReaction, optionals?: MetaV3Optionals): commonParticles.NoReaction;
export function createCommonParticle(
  name: typeof commonParticles.OrganelleInfo,
  organelleName: string,
  location: OrganelleInfoLocation,
  optionals?: MetaV3Optionals
): commonParticles.OrganelleInfo;
export function createCommonParticle(name: typeof commonParticles.EuglenaHasBeenBorn, optionals?: MetaV3Optionals): commonParticles.EuglenaHasBeenBorn;
export function createCommonParticle(
  name: typeof commonParticles[keyof typeof commonParticles],
  ...remains: any[]
): ParticleV3<typeof commonParticles[keyof typeof commonParticles], unknown> {
  switch (name) {
    case commonParticles.EuglenaName:
      const [euglenaName, optionals0] = remains as [string, MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals0), euglenaName);
    case commonParticles.NoReaction:
      return createParticle(createMetaV3(name));
    case commonParticles.ACK:
      const [optionals1] = remains as [MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals1), true);
    case commonParticles.Exception:
      const [message, innerException, optionals2] = remains as [string, sys.type.Exception, MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals2), {
        message,
        innerException
      });
    case commonParticles.Particles:
      const [particleArray6, optionals6] = remains as [Particle[], MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals6), particleArray6);
    case commonParticles.Metas:
      const [metas, optionals7] = remains as [Meta[], MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals7), metas);
    case commonParticles.OrganelleInfo:
      const [organelleName, location, optionals8] = remains as [string, OrganelleInfoLocation, MetaV3Optionals];
      return createParticle(createMetaV3(name, optionals8), {
        organelleName,
        location
      });
    case commonParticles.EuglenaHasBeenBorn:
      const [optionals9] = remains as [MetaV3Optionals];
      return createParticle(createMetaV3(commonParticles.EuglenaHasBeenBorn, optionals9));
  }
}

/**
 * Aliases
 */
export const pc = createCommonParticle;
