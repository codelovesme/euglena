import { cp } from "../particle";
import { BindSingletonOrganelleReactions, BindOrganelleReactions } from "./bind-reaction.h";
import { DefineOrganelleModuleCreate } from "./define-organelle-module-create.h";
import {
    Sap,
    CreateAllOrganelleParticles,
    InComingParticleNameUnion,
    OutGoingParticleNameUnion,
    AllOrganelleParticles,
    CreateOrganelleParticles,
    InsertSapIntoParticles
} from "./particles.h";
import { OrganelleModule } from "./organelle-module.h";
import { com as createOrganelleModule } from "./create-organelle-module";
import { CreateOrganelleModuleInterface } from "./define-organelle-module-create.h";

const defineOrganelleModuleCreate: DefineOrganelleModuleCreate = <
    COP extends AllOrganelleParticles,
    OrganelleName extends "EndoplasmicReticulum" | "Nucleus"
>(
    incomingParticleNames: InComingParticleNameUnion<COP>[],
    outgoingParticleNames: OutGoingParticleNameUnion<COP>[],
    organelleName?: OrganelleName
): CreateOrganelleModuleInterface<COP, OrganelleName> | CreateOrganelleModuleInterface<COP> => {
    const createParticles: CreateAllOrganelleParticles<COP> = {
        incoming: ((incomingParticleNames as any) as string[]).reduce(
            (acc, curr) => ({
                ...acc,
                [curr]: cp.bind(undefined, curr)
            }),
            ({ ["Sap"]: cp.bind(undefined, "Sap") } as any) as CreateOrganelleParticles<COP["incoming"]>
        ),
        outgoing: ((outgoingParticleNames as any) as string[]).reduce(
            (acc, curr) => ({
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
 * defineOrganelleModuleCreate
 */
export const domc = defineOrganelleModuleCreate;
