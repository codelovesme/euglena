import {
    OrganelleReceive,
    OrganelleModule,
    CreateOrganelleModule,
    CreateOrganelle,
    InComingParticle,
    OutGoingParticle,
    AllOrganelleParticles,
    DefineOrganelleModuleCreate,
    CreateOrganelleModuleInterface,
    InsertSapIntoParticles,
    BindReactions,
    CreateAllOrganelleParticles,
    InComingParticleNameUnion,
    CreateOrganelleParticles,
    OutGoingParticleNameUnion,
    Sap
} from "./organelle.h";
import { cp, Particle } from "../particle";

export const createOrganelleModule: CreateOrganelleModule = <
    COP extends AllOrganelleParticles,
    OrganelleType extends string
>(
    createParticles: CreateAllOrganelleParticles<COP>,
    bindReactions: BindReactions<COP, OrganelleType>
): OrganelleModule<COP> => {
    const createOrganelle: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>> = <
        OrganelleName extends string
    >(
        name: OrganelleName,
        transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>
    ): OrganelleReceive<InComingParticle<COP>, OutGoingParticle<COP>> => async (particle) => {
        let reaction = bindReactions[particle.meta.class];
        if (reaction) {
            const t = transmit ? transmit.bind(undefined, name) : undefined;
            return await reaction(particle, {
                transmit: t,
                t: t,
                createParticle: createParticles["outgoing"],
                cp: createParticles["outgoing"]
            });
        } else {
            // return cps.Log(
            //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
            //     "Error"
            // );
            console.error(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    };

    return {
        createParticles: createParticles,
        /**
         * Alias for createParticles
         */
        cp: createParticles,
        createOrganelle,
        /**
         * Alias for createOrganelle
         */
        co: createOrganelle
    };
};

export const defineOrganelleModuleCreate: DefineOrganelleModuleCreate = <COP extends AllOrganelleParticles>(
    incomingParticleNames: InComingParticleNameUnion<COP>[],
    outgoingParticleNames: OutGoingParticleNameUnion<COP>[]
): CreateOrganelleModuleInterface<COP> => {
    const createParticles: CreateAllOrganelleParticles<COP> = {
        incoming: ((incomingParticleNames as any) as string[]).reduce(
            (acc, curr: InComingParticleNameUnion<COP>) => ({
                ...acc,
                [curr]: cp.bind(undefined, curr)
            }),
            ({ ["Sap"]: cp.bind(undefined, "Sap") } as any) as CreateOrganelleParticles<COP["incoming"]>
        ),
        outgoing: ((outgoingParticleNames as any) as string[]).reduce(
            (acc, curr: OutGoingParticleNameUnion<COP>) => ({
                ...acc,
                [curr]: cp.bind(undefined, curr)
            }),
            {} as CreateOrganelleParticles<COP["outgoing"]>
        )
    };
    return {
        createOrganelleModule: <
            S extends Sap,
            OrganelleType extends "EndoplasmicReticulum" | "Nucleus" | "Other" = "Other"
        >(
            bindReactions: BindReactions<InsertSapIntoParticles<COP, S>, OrganelleType>
        ): any =>
            createOrganelleModule(
                createParticles as CreateAllOrganelleParticles<InsertSapIntoParticles<COP, S>>,
                bindReactions
            ),
        com: <S extends Sap, OrganelleType extends "EndoplasmicReticulum" | "Nucleus" | "Other" = "Other">(
            bindReactions: BindReactions<InsertSapIntoParticles<COP, S>, OrganelleType>
        ): any =>
            createOrganelleModule(
                createParticles as CreateAllOrganelleParticles<InsertSapIntoParticles<COP, S>>,
                bindReactions
            ),
        createParticles: createParticles,
        cp: createParticles
    };
};

/**
 * Alias for createOranelleModule
 */
export const com = createOrganelleModule;
/**
 * Alias for defineOrganelleModuleCreate
 */
export const domc = defineOrganelleModuleCreate;
