import { Particle } from "./particle.h";
import { CytoplasmReceive, OrganelleReaction } from "./cytoplasm.h";
export declare type CreateParticles<T1 extends {
    [x: string]: (...args: unknown[]) => Particle;
} = {
    [x: string]: (...args: unknown[]) => Particle;
}> = T1;
export declare type CreateOrganelleParticles<T1 extends {
    [x: string]: (...args: unknown[]) => Particle;
} = {
    [x: string]: (...args: unknown[]) => Particle;
}, T2 extends {
    [x: string]: (...args: unknown[]) => Particle;
} = {
    [x: string]: (...args: unknown[]) => Particle;
}> = {
    incoming: CreateParticles<T1>;
    outgoing: CreateParticles<T2>;
};
export declare type ParticleNameUnion<CP extends CreateParticles> = keyof CP;
export declare type ParticleUnion<CP extends CreateParticles> = ReturnType<CP[keyof CP]>;
export declare type ParticleType<CP extends CreateParticles, PNU extends ParticleNameUnion<CP>> = ReturnType<CP[PNU]>;
export declare type InComingParticleUnion<COP extends CreateOrganelleParticles> = ParticleUnion<COP["incoming"]>;
export declare type OutGoingParticleUnion<COP extends CreateOrganelleParticles> = ParticleUnion<COP["outgoing"]>;
export declare type InComingParticleNameUnion<COP extends CreateOrganelleParticles> = ParticleNameUnion<COP["incoming"]>;
export declare type OutGoingParticleNameUnion<COP extends CreateOrganelleParticles> = ParticleNameUnion<COP["outgoing"]>;
export declare type InComingParticleType<COP extends CreateOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> = ReturnType<COP["incoming"][IPNU]>;
export declare type OutGoingParticleType<COP extends CreateOrganelleParticles, OPNU extends OutGoingParticleNameUnion<COP>> = ReturnType<COP["outgoing"][OPNU]>;
export interface OrganelleReceive<InComingParticle extends Particle = Particle, OutGoingParticle extends Particle = Particle> {
    (particle: InComingParticle): Promise<OutGoingParticle | void>;
}
export interface CreateOrganelle<InComingParticle extends Particle = Particle, OutGoingParticle extends Particle = Particle> {
    (receive: CytoplasmReceive): OrganelleReceive<InComingParticle, OutGoingParticle>;
}
export interface OrganelleModule<OrganelleName extends string, COP extends CreateOrganelleParticles> {
    name: OrganelleName;
    /**
     * Alias for name
     */
    n: OrganelleName;
    createOrganelle: CreateOrganelle<ParticleUnion<COP["incoming"]>, ParticleUnion<COP["outgoing"]>>;
    /**
     * Alias for CreateOrganelle
     */
    co: CreateOrganelle<ParticleUnion<COP["incoming"]>, ParticleUnion<COP["outgoing"]>>;
    createParticles: COP;
    /**
     * Alias for CreateParticles
     */
    cp: COP;
}
export interface CreateOrganelleModule {
    <OrganelleName extends string, COP extends CreateOrganelleParticles>(name: OrganelleName, createParticles: COP, bindReactions: BindReactions<COP>): OrganelleModule<OrganelleName, COP>;
}
export interface AddReaction<COP extends CreateOrganelleParticles> {
    <IPNU extends InComingParticleNameUnion<COP>>(particleName: IPNU, reaction: OrganelleReaction<COP, IPNU>): void;
}
export interface BindReactions<COP extends CreateOrganelleParticles> {
    (addReaction: AddReaction<COP>): void;
}
