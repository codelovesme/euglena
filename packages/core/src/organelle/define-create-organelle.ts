import { cp } from "../particle";
import { BindOrganelleReactions } from "./bind-reaction.h";
import { DefineCreateOrganelle } from "./define-create-organelle.h";

import { Particle } from "../particle";
import { CreateOrganelle } from "./create-organelle.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { AllInteractions, ComingParticles, ComingResponseParticle, Interaction } from "./particle";
import { InsertSapIntoParticles } from "./utils";

export const dco: DefineCreateOrganelle =
    <COP extends AllInteractions, I extends Interaction>(
        bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
    ): CreateOrganelle<ComingParticles<COP>,ComingResponseParticle<COP>> =>
    <OrganelleName extends string>(params: {
        name: OrganelleName;
        transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
    }): OrganelleReceive<ComingParticles<COP>, ComingResponseParticle<COP>> =>
    async (particle) => {
        const name = params.name;
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
            console.error(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    };
