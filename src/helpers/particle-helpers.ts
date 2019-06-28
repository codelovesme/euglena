import { v4 as uuid } from "uuid";
import { MetaV2, MetaV3Optionals, MetaV3, MetaV1, ParticleV1, ParticleV2, ParticleV3, Meta, Particle } from "../particle";

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
export function createMetaV3<NameType>(name: NameType, optionals?: MetaV3Optionals): MetaV3<NameType> {
  return {
    id: uuid(),
    name: name,
    version: "v3",
    createTime: new Date().getTime(),
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
      return typeof metaV3.name === "string" && typeof metaV3.createTime === "number" && typeof metaV3.id === "string";
    case "v2":
      let meta = particle.meta as MetaV2;
      return typeof meta.name === "string" && typeof meta.of === "string" && typeof meta.createTime === "number";
    case "v1":
    default:
      return particle.meta.name ? true : false;
  }
}

export function isParticleV1(particle: Particle): particle is ParticleV1 {
  return particle && particle.meta && (particle.meta.version === "v1" || typeof particle.meta.version === "undefined");
}
export function isParticleV2(particle: Particle): particle is ParticleV2 {
  return particle && particle.meta && particle.meta.version === "v3";
}
export function isParticleV3(particle: Particle): particle is ParticleV3 {
  return particle && particle.meta && particle.meta.version === "v3";
}

export function assertNotParticle(particle: never, message: string): void {
  throw message || `Assertion fails: ${particle} is a particle where it shouldn't be`;
}

/**
 * Aliases
 */
export const p = createParticle;
export const m1 = createMetaV1;
export const m2 = createMetaV2;
export const m3 = createMetaV3;
