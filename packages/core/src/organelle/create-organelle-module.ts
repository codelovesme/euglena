import { Particle } from "../particle";
import { CreateOrganelleModule } from "./create-organelle-module.h";
import { CreateOrganelle } from "./create-organelle.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { InComingParticle, OutGoingParticle, AllOrganelleParticles, CreateAllOrganelleParticles } from "./particles.h";

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
        cp: createParticles,
        /**
         * createOrganelle
         */
        co: createOrganelle
    } as any;
};

/**
 * createOranelleModule
 */
export const com = createOrganelleModule;
