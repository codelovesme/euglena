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
    BindOrganelleReactions,
    CreateAllOrganelleParticles,
    InComingParticleNameUnion,
    CreateOrganelleParticles,
    OutGoingParticleNameUnion,
    Sap,
    BindSingletonOrganelleReactions
} from "./organelle.h";
import { cp, Particle } from "../particle";

const createOrganelleModule: CreateOrganelleModule = <
    COP extends AllOrganelleParticles,
    OrganelleName extends "EndoplasmicReticulum" | "Nucleus" | undefined = undefined
>(
    createParticles: CreateAllOrganelleParticles<COP>,
    bindReactions: BindOrganelleReactions<COP>,
    organelleName?: OrganelleName
) => {
    const createOrganelle: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>> = <
        OrganelleName extends string
    >(params?: {
        name?: OrganelleName;
        transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
    }): OrganelleReceive<InComingParticle<COP>, OutGoingParticle<COP>> => async (particle) => {
        const name = organelleName || params?.name;
        let reaction = bindReactions[particle.meta.class];
        if (reaction) {
            const t = params?.transmit ? params?.transmit.bind(undefined, name) : undefined;
            return await reaction(particle, {
                t: t,
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
        /**
         * createParticles
         */
        cp: createParticles,
        /**
         * createOrganelle
         */
        co: createOrganelle
    } as any;
};

const defineOrganelleModuleCreate: DefineOrganelleModuleCreate = <
    COP extends AllOrganelleParticles,
    OrganelleName extends "EndoplasmicReticulum" | "Nucleus" | undefined = undefined
>(
    incomingParticleNames: InComingParticleNameUnion<COP>[],
    outgoingParticleNames: OutGoingParticleNameUnion<COP>[],
    organelleName?: OrganelleName
): CreateOrganelleModuleInterface<COP, OrganelleName> => {
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
        com: organelleName
            ? <S extends Sap>(
                  bindReactions: BindSingletonOrganelleReactions<NonNullable<OrganelleName>, COP, S>
              ): OrganelleModule<InsertSapIntoParticles<COP, S>> =>
                  createOrganelleModule(
                      createParticles as CreateAllOrganelleParticles<InsertSapIntoParticles<COP, S>>,
                      bindReactions,
                      organelleName!
                  ) as any
            : <S extends Sap>(
                  bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>
              ): OrganelleModule<InsertSapIntoParticles<COP, S>> =>
                  createOrganelleModule(
                      createParticles as CreateAllOrganelleParticles<InsertSapIntoParticles<COP, S>>,
                      bindReactions
                  ),
        cp: createParticles
    } as any;
};

/**
 * createOranelleModule
 */
export const com = createOrganelleModule;
/**
 * defineOrganelleModuleCreate
 */
export const domc = defineOrganelleModuleCreate;
