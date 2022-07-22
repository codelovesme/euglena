import { Particle, MetaAdditions } from "../particle";
import { FindParticle, FindInteraction } from "./utils";
import { Interaction } from "./particle";

export type P<Data = any, Adds extends MetaAdditions = {}> = {
    data: Data;
    adds: Adds;
};

export type FromP<Class extends string, R extends P> = Particle<Class, R["data"], R["adds"]>;

//@ts-ignore
export type ToP<Par extends Particle> = P<Par["data"], Omit<Par["meta"], "class">>;

export type Sap<
    Data = any,
    Adds extends MetaAdditions & { organelleName: string } = {
        organelleName: string;
    }
> = P<Data, Adds>;

export type OrganelleParticles<ParticleUnion extends Particle = Particle> = {
    [Class in ParticleUnion["meta"]["class"]]: ToP<FindParticle<ParticleUnion, Class>>;
};

export type SapInteraction = Interaction<Particle<"Sap", any, { organelleName: string }>>;

export type AllOrganelleParticles<I extends Interaction[] = Interaction[]> = I;

export type Incoming<T extends AllOrganelleParticles> = OrganelleParticles<T[number][0]>;
export type Outgoing<T extends AllOrganelleParticles> = T[number][1] extends undefined
    ? {}
    : OrganelleParticles<Exclude<T[number][1], undefined>>;

export type InComingParticleNameUnion<COP extends AllOrganelleParticles> = COP[number][0]["meta"]["class"];

export type InComingParticle<
    COP extends AllOrganelleParticles,
    N extends InComingParticleNameUnion<COP> = InComingParticleNameUnion<COP>
> = FindInteraction<COP[number], N>[0];

export type OutGoingParticle<
    COP extends AllOrganelleParticles,
    N extends InComingParticleNameUnion<COP> = InComingParticleNameUnion<COP>,
    M extends string = string
> = FindParticle<FindInteraction<COP[number], N>[1],M>;

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, I extends SapInteraction> = [I, ...COP];
