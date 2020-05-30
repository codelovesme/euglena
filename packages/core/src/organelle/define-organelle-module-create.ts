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
import { CreateOrganelleModuleInterface } from "./define-organelle-module-create.h";
import { SingletonOrganelleName } from "./singleton-organelle.h";

import { Particle } from "../particle";
import { CreateOrganelle } from "./create-organelle.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { InComingParticle, OutGoingParticle } from "./particles.h";

const defineOrganelleModuleCreate: DefineOrganelleModuleCreate = <
    COP extends AllOrganelleParticles,
    OrganelleName extends SingletonOrganelleName
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

    const createOrganelleModule = <
        COP extends AllOrganelleParticles,
        OrganelleName extends SingletonOrganelleName | undefined = undefined
    >(
        createParticles: CreateAllOrganelleParticles<COP>,
        bindReactions: BindOrganelleReactions<COP>,
        organelleName?: OrganelleName
    ) => {
        const createOrganelle: CreateOrganelle<InComingParticle<COP>, OutGoingParticle<COP>> = <
            OrganelleName extends string
        >(params?: {
            name?: OrganelleName;
            transmit?: (
                sourceOrganelle: string,
                particle: Particle,
                targetOrganelle?: string
            ) => Promise<Particle | void>;
        }): OrganelleReceive<InComingParticle<COP>, OutGoingParticle<COP>> => async (particle) => {
            const name = organelleName || params?.name;
            let reaction: any = bindReactions[particle.meta.class] as any;
            if (reaction) {
                const t = params?.transmit ? params?.transmit.bind(undefined, name as string) : undefined;
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
            cs: createParticles.incoming["Sap"],
            /**
             * createOrganelle
             */
            co: createOrganelle
        } as any;
    };

    return {
        com: organelleName
            ? <S extends Sap>(
                  bindReactions: BindSingletonOrganelleReactions<NonNullable<OrganelleName>, COP, S>
              ): OrganelleModule<S, InsertSapIntoParticles<COP, S>> =>
                  createOrganelleModule(
                      createParticles as CreateAllOrganelleParticles<InsertSapIntoParticles<COP, S>>,
                      bindReactions,
                      organelleName!
                  ) as any
            : <S extends Sap>(
                  bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, S>>
              ): OrganelleModule<S, InsertSapIntoParticles<COP, S>> =>
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
