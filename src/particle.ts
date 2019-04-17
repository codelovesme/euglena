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
export interface MetaV3<NameType> {
  id: string;
  name: NameType;
  version: "v3";
  createdAt: number;
  createdBy: string;
  expireAt?: number;
  tags?: Tags;
}

export type Meta = MetaV1 | MetaV2 | MetaV3<string>;

export interface ParticleV1 {
  meta: any;
  data?: any;
}
export interface ParticleV2<T> {
  meta: MetaV2;
  data?: T;
}

export interface ParticleV3<NameType, DataType = undefined> {
  meta: MetaV3<NameType>;
  data?: DataType;
  labels?: { [key: string]: unknown };
}

export type Particle = ParticleV1 | ParticleV2<unknown> | ParticleV3<string, unknown>;

export interface MetaV3Optionals {
  expireAt?: number;
  tags?: Tags;
}
