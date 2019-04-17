import { v4 as uuid } from "uuid";
import { MetaV2, MetaV3Optionals, MetaV3, MetaV1, ParticleV1, ParticleV2, ParticleV3, Meta, Particle } from "../particle";
import { sys } from "cessnalib";

export function createMetaV1(params: object) {
  return params;
}
export function createMetaV2(name: string, of: string, expireTime?: number): MetaV2 {
  return {
    name,
    version: "v2",
    of,
    createTime: new Date().getTime(),
    expireTime
  };
}
export function createMetaV3<NameType>(name: NameType, createdBy: string, optionals?: MetaV3Optionals): MetaV3<NameType> {
  return {
    id: uuid(),
    name,
    version: "v3",
    createdAt: new Date().getTime(),
    createdBy,
    ...optionals
  };
}

export function createParticle(meta: MetaV1, data?: any): ParticleV1;
export function createParticle<DataType>(meta: MetaV2, data?: DataType): ParticleV2<DataType>;
export function createParticle<NameType, DataType>(meta: MetaV3<NameType>, labels?: { [key: string]: unknown }, data?: DataType): ParticleV3<NameType, DataType>;
export function createParticle(meta: Meta, data?: any): Particle {
  return { meta, data };
}

export function validateParticle(particle: Particle): boolean {
  if (!particle || !particle.meta) return false;
  switch ((particle.meta as any).version) {
    case "v3":
      const metaV3 = particle.meta as MetaV3<string>;
      return typeof metaV3.name === "string" && typeof metaV3.createdAt === "number" && typeof metaV3.id === "string";
    case "v2":
      let meta = particle.meta as MetaV2;
      return typeof meta.name === "string" && typeof meta.of === "string" && typeof meta.createTime === "number";
    case "v1":
    default:
      return particle.meta.name ? true : false;
  }
}

/**
 * Common particles
 */

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

export function createCommonParticle(name: typeof commonParticles.EuglenaName, createdBy: string, optionals?: MetaV3Optionals): commonParticles.EuglenaName;
export function createCommonParticle(name: typeof commonParticles.ACK, createdBy: string, optionals?: MetaV3Optionals): commonParticles.ACK;
export function createCommonParticle(
  name: typeof commonParticles.Exception,
  createdBy: string,
  message: string,
  innerException?: sys.type.Exception,
  optionals?: MetaV3Optionals
): commonParticles.Exception;
export function createCommonParticle(name: typeof commonParticles.Particles, createdBy: string, particlesArray: Particle[], optionals?: MetaV3Optionals): commonParticles.Particles;
export function createCommonParticle(name: typeof commonParticles.Metas, createdBy: string, metas: Meta[], optionals?: MetaV3Optionals): commonParticles.Metas;
export function createCommonParticle(name: typeof commonParticles.NoReaction, createdBy: string, optionals?: MetaV3Optionals): commonParticles.NoReaction;
export function createCommonParticle(
  name: typeof commonParticles.OrganelleInfo,
  createdBy: string,
  organelleName: string,
  location: OrganelleInfoLocation,
  optionals?: MetaV3Optionals
): commonParticles.OrganelleInfo;
export function createCommonParticle(name: typeof commonParticles.EuglenaHasBeenBorn, createdBy: string, optionals?: MetaV3Optionals): commonParticles.EuglenaHasBeenBorn;
export function createCommonParticle(
  name: typeof commonParticles[keyof typeof commonParticles],
  createdBy: string,
  ...remains: any[]
): ParticleV3<typeof commonParticles[keyof typeof commonParticles], unknown> {
  switch (name) {
    case commonParticles.EuglenaName:
      const [euglenaName, optionals0] = remains as [string, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals0), euglenaName);
    case commonParticles.NoReaction:
      return createParticle(createMetaV3(name, createdBy));
    case commonParticles.ACK:
      const [optionals1] = remains as [MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals1), true);
    case commonParticles.Exception:
      const [message, innerException, optionals2] = remains as [string, sys.type.Exception, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals2), {
        message,
        innerException
      });
    case commonParticles.Particles:
      const [particleArray6, optionals6] = remains as [Particle[], MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals6), particleArray6);
    case commonParticles.Metas:
      const [metas, optionals7] = remains as [Meta[], MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals7), metas);
    case commonParticles.OrganelleInfo:
      const [organelleName, location, optionals8] = remains as [string, OrganelleInfoLocation, MetaV3Optionals];
      return createParticle(createMetaV3(name, createdBy, optionals8), {
        organelleName,
        location
      });
    case commonParticles.EuglenaHasBeenBorn:
      const [optionals9] = remains as [MetaV3Optionals];
      return createParticle(createMetaV3(commonParticles.EuglenaHasBeenBorn, createdBy, optionals9));
  }
}

/**
 * Aliases
 */
export const p = createParticle;
export const pc = createCommonParticle;
export const m1 = createMetaV1;
export const m2 = createMetaV2;
export const m3 = createMetaV3;
