import { cp } from "../particle";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { DefineOrganelleModuleCreate } from "./define-organelle-module-create.h";
import {
    Sap,
    AllOrganelleParticles,
    InsertSapIntoParticles,
    FromP,
    SapInteraction,
    ToP
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
    organelleName?: OrganelleName
): CreateOrganelleModuleInterface<COP, OrganelleName> | CreateOrganelleModuleInterface<COP> => {
    return {
        com: <I extends SapInteraction>(
            bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
        ): OrganelleModule<ToP<I[0]>, InsertSapIntoParticles<COP, I>> => {
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
                let reaction: any = (bindReactions as any)[(particle as any).meta.class] as any;
                if (reaction) {
                    const t = params?.transmit ? params?.transmit.bind(undefined, name as string) : undefined;
                    return await reaction(particle, {
                        t: t,
                        cp: cp
                    });
                } else {
                    // return cps.Log(
                    //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
                    //     "Error"
                    // );
                    console.error(
                        `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`
                    );
                }
            };

            return {
                /**
                 * createParticles
                 */
                cs: (data: any, adds: any) => {
                    const sap = cp("Sap",data, adds) as FromP<string, Sap>;
                    return organelleName
                        ? {
                              ...sap,
                              meta: {
                                  ...sap.meta,
                                  organelleName
                              }
                          }
                        : sap;
                },
                /**
                 * createOrganelle
                 */
                co: createOrganelle
            } as any;
        },
        cp: cp
    } as any;
};

/**
 * defineOrganelleModuleCreate
 */
export const domc = defineOrganelleModuleCreate;
