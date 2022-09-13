import { cp } from "./particle";
import {
    AllInteractions,
    BindOrganelleReactions,
    ComingParticles,
    ComingResponseParticle,
    CreateOrganelle,
    DefineCreateOrganelle,
    GoingParticleNameUnion,
    InsertSapIntoParticles,
    Interaction,
    OrganelleReceive,
    Particle
} from "../types";
import { ts } from "cessnalib";

export const dco: DefineCreateOrganelle =
    <COP extends AllInteractions, I extends Interaction>(
        goingParticles: ts.TupleFromUnion<GoingParticleNameUnion<COP>>,
        bindReactions: BindOrganelleReactions<InsertSapIntoParticles<COP, I>>,
    ): CreateOrganelle<ComingParticles<COP>, ComingResponseParticle<COP>> =>
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
                cp: (goingParticles as GoingParticleNameUnion<COP>[]).reduce(
                    (acc, curr) => ({
                        ...acc,
                        [curr]: (...params: any[]) => cp(curr, ...params)
                    }),
                    {}
                )
            });
        } else {
            // return cps.Log(
            //     `There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`,
            //     "Error"
            // );
            console.error(`There is no reaction of ${name} for given particle ${JSON.stringify(particle.meta)}`);
        }
    };
