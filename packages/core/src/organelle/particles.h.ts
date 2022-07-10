import { Particle, MetaAdditions } from "../particle";

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

type Find<Class extends string, ParticleUnion extends Particle> = ParticleUnion extends { meta: { class: Class } }
    ? ParticleUnion
    : never;

export type OrganelleParticles<ParticleUnion extends Particle = Particle> = {
    [P in ParticleUnion["meta"]["class"]]: ToP<Find<P, ParticleUnion>>;
};

export type Interaction = [Particle] | [Particle, Particle] | [Particle, Particle, Particle];
export type SapInteraction = [Particle<"Sap", any, { organelleName: string }>];

export type AllOrganelleParticles<I extends Interaction[] = Interaction[]> = I;

export type Incoming<T extends AllOrganelleParticles> = OrganelleParticles<T[number][0]>;
export type Outgoing<T extends AllOrganelleParticles> = T[number][1] extends undefined
    ? {}
    : OrganelleParticles<Exclude<T[number][1], undefined>>;

export type InComingParticleNameUnion<COP extends AllOrganelleParticles> = COP[number][0]["meta"]["class"];

export type OutGoingParticleNameUnion<COP extends AllOrganelleParticles> = Exclude<COP[number][1],void>["meta"]["class"];

export type InComingParticle<
    COP extends AllOrganelleParticles,
    N extends InComingParticleNameUnion<COP> = InComingParticleNameUnion<COP>
> = {
    [P in N]: Find<P, COP[number][0]>;
}[N];

export type OutGoingParticle<
    COP extends AllOrganelleParticles,
    N extends InComingParticleNameUnion<COP> = InComingParticleNameUnion<COP>
> = {
    [P in N]: Find<P, Exclude<COP[number][1], undefined>>;
}[N];

export type InsertSapIntoParticles<COP extends AllOrganelleParticles, I extends SapInteraction> = [I, ...COP];
