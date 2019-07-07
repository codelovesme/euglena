export type MetaV1 = unknown;
export interface MetaV2 {
  name: string;
  of: string;
  version: "v2";
  createTime: number;
  expireTime?: number;
}

export interface Tags {
  [key: string]: unknown;
}
export interface MetaV3<NameType = string> {
  id: string;
  name: NameType;
  version: "v3";
  createTime: number;
  expireTime?: number;
  tags?: Tags;
}

export type Meta = MetaV1 | MetaV2 | MetaV3;

export interface ParticleV1 {
  meta: any;
  data?: any;
}
export interface ParticleV2<T = unknown> {
  meta: MetaV2;
  data?: T;
}

export interface ParticleV3<NameType = string, DataType = unknown> {
  meta: MetaV3<NameType>;
  data?: DataType;
  labels?: { [key: string]: unknown };
}

export type Particle = ParticleV1 | ParticleV2 | ParticleV3;

export interface MetaV3Optionals {
  expireTime?: number;
  tags?: Tags;
}
