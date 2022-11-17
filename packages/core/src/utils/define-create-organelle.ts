import {
    AllInteractions,
    BindOrganelleReactions,
    ComingParticles,
    ComingResponseParticle,
    CreateOrganelle,
    DefineCreateOrganelle,
    InsertSapIntoParticles,
    Interaction,
    OrganelleReceive,
    Particle
} from "../types";
import { cp } from "./particle";

export const dco: DefineCreateOrganelle =
    <COP extends AllInteractions, I extends Interaction>(
        bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>
    ): CreateOrganelle<ComingParticles<COP>, ComingResponseParticle<COP>> =>
    <OrganelleName extends string>(params: {
        name: OrganelleName;
        transmit?: (sourceOrganelle: string, particle: Particle, targetOrganelle?: string) => Promise<Particle | void>;
    }): OrganelleReceive<ComingParticles<COP>, ComingResponseParticle<COP>> =>
    async (particle) => {
        const name = params.name;
        let reaction: any = (bindReactions as any)[(particle as any).meta.class] as any;
        if (reaction) {
            return await reaction(particle, {
                t: (particle: Particle) => params.transmit?.(name, particle, "Nucleus"),
                cp: cp
            });
        } else {
            // return cps.Log(
            //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
            //     "Error"
            // );
            console.log(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    };
