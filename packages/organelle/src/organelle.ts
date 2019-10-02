import { ccp } from "@euglena/common";
import {
    OrganelleReceive,
    OrganelleModule,
    CreateOrganelleModule,
    CreateOrganelle,
    InComingParticleUnion,
    OutGoingParticleUnion,
    CreateOrganelleParticles,
    DefineOrganelleModuleCreate,
    CreateOrganelleModuleInterface,
    InsertSapIntoParticles,
    BindReactions
} from "./organelle.h";
import { Particle } from "@euglena/particle";

export const createOrganelleModule: CreateOrganelleModule = <
    OrganelleName extends string,
    COP extends CreateOrganelleParticles
>(
    name: OrganelleName,
    createParticles: COP,
    bindReactions: BindReactions<COP>
): OrganelleModule<OrganelleName, COP> => {
    const createOrganelle: CreateOrganelle<InComingParticleUnion<COP>, OutGoingParticleUnion<COP>> = (
        transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>
    ): OrganelleReceive<InComingParticleUnion<COP>, OutGoingParticleUnion<COP>> => async (particle) => {
        let reaction = bindReactions[particle.meta.name];
        if (reaction) {
            const t = transmit ? transmit.bind(undefined, name) : undefined;
            return reaction(particle, {
                transmit: t,
                t: t,
                createParticle: createParticles["outgoing"],
                cp: createParticles["outgoing"]
            });
        } else {
            // return ccp.Log(
            //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
            //     "Error"
            // );
            console.error(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    };

    return {
        name,
        /**
         * Alias for name
         */
        n: name,
        createParticles,
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

export const defineOrganelleModuleCreate: DefineOrganelleModuleCreate = <
    OrganelleName extends string,
    COP extends CreateOrganelleParticles
>(
    name: OrganelleName,
    createParticles: COP
): CreateOrganelleModuleInterface<OrganelleName, COP> => ({
    n: name,
    name: name,
    createOrganelleModule: <SapData>(
        bindReactions: BindReactions<InsertSapIntoParticles<COP, SapData>>
    ): OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, SapData>> =>
        createOrganelleModule(
            name,
            ({
                ...createParticles,
                incoming: {
                    ...createParticles.incoming,
                    ["Sap"]: ccp.Sap
                }
            } as unknown) as InsertSapIntoParticles<COP, SapData>,
            bindReactions
        ),
    com: <SapData>(
        bindReactions: BindReactions<InsertSapIntoParticles<COP, SapData>>
    ): OrganelleModule<OrganelleName, InsertSapIntoParticles<COP, SapData>> =>
        createOrganelleModule(
            name,
            ({
                ...createParticles,
                incoming: {
                    ...createParticles.incoming,
                    ["Sap"]: ccp.Sap
                }
            } as unknown) as InsertSapIntoParticles<COP, SapData>,
            bindReactions
        ),
    createParticles: createParticles,
    cp: createParticles
});

/**
 * Alias for createOranelleModule
 */
export const com = createOrganelleModule;
/**
 * Alias for defineOrganelleModuleCreate
 */
export const domc = defineOrganelleModuleCreate;
