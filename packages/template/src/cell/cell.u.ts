import { sys } from "cessnalib";
import { OrganelleInfo, Sap } from "./organelle";
import { EuglenaHasBeenBorn } from "./euglena-has-been-born.par.h";
import { CreateOrganelle, OrganelleReceive, Particle, cp, isParticleClass } from "@euglena/core";
import { createNucleusComingParticle } from "./genetics";
import { createException } from "../exception.par.u";

type Transmit = (particle: Particle) => Promise<Particle>;

const reticulumName = "Reticulum";
const nucleusName = "Nucleus";

const organelles: { [organelleName: string]: OrganelleReceive } = {};

export const getOrganelles = () => organelles;

export const reviveOrganelle = async ({ data }: OrganelleInfo) => {
    let organelle: CreateOrganelle | undefined = undefined;
    switch (data.location.type) {
        case "FileSystemPath":
        case "NodeModules":
        case "Url":
            try {
                organelle = (await import(data.location.path)).default;

                //t(cp.Info(`${organelle.name} attached to the body.`, "Info"));
            } catch (e: any) {
                console.log(`Error - While reviving organelle ${data.name} : ${e.message}`);
                //t(cp.Info(organelleInfoData.name + " " + e.message, "Error"));
            }
            break;
        case "InMemory":
            organelle = data.location.organelle;
            break;
    }
    return organelle;
};

export const attachOrganelle = async (organelleInfo: OrganelleInfo, transmit: Transmit): Promise<void> => {
    let createOrganelle = await reviveOrganelle(organelleInfo);
    const { data: organelleInfoData } = organelleInfo;
    if (createOrganelle) {
        const revivedOrganelle = await createOrganelle({ name: organelleInfoData.name, transmit });
        if (revivedOrganelle) {
            organelles[organelleInfoData.name] = revivedOrganelle;
            console.log(`Info - ${organelleInfoData.name} attached to the body.`);
        } else {
            throw `Error - ${organelleInfoData.name} can not be revived.`;
        }
    }
};

export const transmit = async (particle: Particle, target: string) => {
    console.log(`Info - Transmitting particle: ${particle.meta.class} to ${target}`);
    const organelleReceive: OrganelleReceive = organelles[target];
    if (!organelleReceive) {
        return createException("Exception", new sys.Exception(`Organelle ${target} has not been connected yet!`));
    }
    //Triggers recursive calls
    // t(cp("Log", { message: `Transmitting ${JSON.stringify(meta)} to ${target}`, level: "Info" }));
    return await organelleReceive(particle);
};

export const createEuglena = async (particles: Particle[]) => {
    /**
     * Attach organelles
     */
    const organelleInfos = particles.filter((x) => x.meta.class === "OrganelleInfo") as OrganelleInfo[];
    for (const organelleInfo of organelleInfos) {
        await attachOrganelle(organelleInfo, async (p: Particle) => {
            p = createNucleusComingParticle("ReceiveParticle", { particle: p, source: organelleInfo.data.name });
            return await transmit(p, nucleusName);
        });
    }
    /**
     * Send their saps
     */
    await Promise.all(
        Object.entries(organelles).map(async ([organelleName, organelleReceive]) => {
            const relatedSap = particles.find(
                (x) => x.meta.class === "Sap" && (x as Sap).meta.organelleName === organelleName
            );
            if (relatedSap) await organelleReceive(relatedSap);
        })
    );
    /**
     * Initial Organelles atttached let roll
     */
    const euglenaHasBeenBorn = cp<EuglenaHasBeenBorn>("EuglenaHasBeenBorn");
    const resp = await transmit(
        createNucleusComingParticle("ReceiveParticle", {
            particle: euglenaHasBeenBorn,
            source: reticulumName
        }),
        nucleusName
    );
    if (resp && isParticleClass(resp, "Exception")) throw resp;
};

/**
 * createEuglena
 */
export const ce = createEuglena;
