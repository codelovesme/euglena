import { Particle } from "@euglena/particle";
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
    (transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>): OrganelleReceive<InComingParticle, OutGoingParticle>;
}
export interface OrganelleModule<OrganelleName extends string = string, COP extends CreateOrganelleParticles = CreateOrganelleParticles> {
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
export declare type CreateSap<T> = (organelle: {
    name: string;
    nick?: string;
}, data: T) => Particle<"Sap", T, typeof organelle>;
export declare type InsertSapIntoParticles<COP extends CreateOrganelleParticles, SapData> = {
    incoming: COP["incoming"] & {
        ["Sap"]: CreateSap<SapData>;
    };
    outgoing: COP["outgoing"];
};
export interface CreateOrganelleModuleInterface<OrganelleName extends string, COP extends CreateOrganelleParticles> {
    name: OrganelleName;
    /**
     * Alias for name
     */
    n: OrganelleName;
    createOrganelleModule: <SapData>(bindReactions: OrganelleName extends "EndoplasmicReticulum" ? BindReactionsER<InsertSapIntoParticles<COP, SapData>> : BindReactions<InsertSapIntoParticles<COP, SapData>>) => OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, SapData>>;
    /**
     * Alias for createOrganelleModule
     */
    com: <SapData>(bindReactions: OrganelleName extends "EndoplasmicReticulum" ? BindReactionsER<InsertSapIntoParticles<COP, SapData>> : BindReactions<InsertSapIntoParticles<COP, SapData>>) => OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, SapData>>;
    createParticles: COP;
    /**
     * Alias for createParticles
     */
    cp: COP;
}
export interface DefineOrganelleModuleCreate {
    <OrganelleName extends string, COP extends CreateOrganelleParticles>(name: OrganelleName, createParticles: COP): CreateOrganelleModuleInterface<OrganelleName, COP>;
}
export declare type BindReactions<COP extends CreateOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: OrganelleReaction<COP, P>;
};
export declare type BindReactionsER<COP extends CreateOrganelleParticles> = {
    [P in InComingParticleNameUnion<COP>]: EndoplasmicReticulumReaction<COP, P>;
};
export interface OrganelleTransmit<P extends Particle = Particle, Resp extends Particle | void = Particle | void> {
    (particle: P, targetOrganelle?: string): Promise<Resp>;
}
export interface OrganelleReaction<COP extends CreateOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (particle: ReturnType<COP["incoming"][IPNU]>, tools: {
        transmit: OrganelleTransmit<OutGoingParticleUnion<COP>>;
        /**
         * Alias for receive
         */
        t: OrganelleTransmit<OutGoingParticleUnion<COP>>;
        createParticle: COP["outgoing"];
        /**
         * Alias for createParticle
         */
        cp: COP["outgoing"];
    }): Promise<OutGoingParticleUnion<COP> | void>;
}
export interface EndoplasmicReticulumReaction<COP extends CreateOrganelleParticles, IPNU extends InComingParticleNameUnion<COP>> {
    (particle: ReturnType<COP["incoming"][IPNU]>, tools: {
        createParticle: COP["outgoing"];
        /**
         * Alias for createParticle
         */
        cp: COP["outgoing"];
    }): Promise<OutGoingParticleUnion<COP> | void>;
}
