import { cp } from "../particle";
import { BindOrganelleReactions } from "./bind-reaction.h.spec";
import { CreateOrganelle } from "./create-organelle.h";
import { DefineCreateOrganelle, InsertSapIntoParticles } from "./define-create-organelle.h";
import { ComingParticles, ComingResponseParticle } from "./in-out-particle.h";
import { Interaction } from "./interaction.h";
import { OrganelleInteractions } from "./organelle-interactions.h";
import { OrganelleReceive } from "./organelle-receive.h";
import { OrganelleTransmit } from "./reaction.h";

export const dco: DefineCreateOrganelle =
    <COP extends OrganelleInteractions, I extends Interaction>(
        bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
    ): CreateOrganelle<COP> =>
    (<OrganelleName extends string>(params: {
        name: OrganelleName;
        transmit?: OrganelleTransmit<COP>;
    }): OrganelleReceive<ComingParticles<COP>, ComingResponseParticle<COP>> =>
    async (particle) => {
        const name = params.name;
        let reaction: any = (bindReactions as any)[(particle as any).meta.class] as any;
        if (reaction) {
            return await reaction(particle, {
                t: params.transmit,
                cp: cp
            });
        } else {
            // return cps.Log(
            //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
            //     "Error"
            // );
            console.log(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    }) as any;
