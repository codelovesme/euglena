import { particle, organelle } from "@euglena/core";
import { sys } from "cessnalib";
import { nucleus } from "./organelle";
import { ReceiveParticle } from "./organelle/nucleus";
import { common } from "./particle";

import CreateOrganelle = organelle.CreateOrganelle;
import OrganelleReceive = organelle.OrganelleReceive;
import Transmit = organelle.Transmit;
import Particle = particle.Particle;

const endoplasmicReticulumName = "EndoplasmicReticulum";
const nucleusName = "Nucleus";

const organelles: { [organelleName: string]: OrganelleReceive } = {};

export const getOrganelles = () => organelles;

export const reviveOrganelle = async ({ data }: common.OrganelleInfo) => {
    let organelle: CreateOrganelle<Particle, void | Particle> | undefined;
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

export const attachOrganelle = async (
    organelleInfo: common.OrganelleInfo,
    transmit: (particle: Particle) => Promise<Particle | void>
): Promise<void> => {
    let createOrganelle = await reviveOrganelle(organelleInfo);
    const { data: organelleInfoData } = organelleInfo;
    if (createOrganelle) {
        organelles[organelleInfoData.name] = await createOrganelle({ name: organelleInfoData.name, transmit });
        console.log(`Info - ${organelleInfoData.name} attached to the body.`);
    }
};

export const transmit: Transmit = async (particle: Particle, target: string) => {
    console.log(`Info - Transmitting particle: ${particle.meta.class} to ${target}`);
    const organelleReceive: OrganelleReceive = organelles[target];
    if (!organelleReceive) {
        return common.cp("Exception", new sys.type.Exception(`Organelle ${target} has not been connected yet!`));
    }
    //Triggers recursive calls
    // t(common.cp("Log", { message: `Transmitting ${JSON.stringify(particle.meta)} to ${target}`, level: "Info" }));
    return await organelleReceive(particle);
};

export const createEuglena = async (particles: Particle[]) => {
    /**
     * Attach organelles
     */
    const organelleInfos = particles.filter((x) => x.meta.class === "OrganelleInfo") as common.OrganelleInfo[];
    for (const organelleInfo of organelleInfos) {
        await attachOrganelle(organelleInfo, async (p: Particle) => {
            p = particle.cp<ReceiveParticle>("ReceiveParticle", { particle: p, source: organelleInfo.data.name });
            return await transmit(p, nucleusName);
        });
    }
    /**
     * Send their saps
     */
    await Promise.all(
        Object.entries(organelles).map(async ([organelleName, organelleReceive]) => {
            const relatedSap = particles.find(
                (x) => x.meta.class === "Sap" && (x as common.Sap).meta.organelleName === organelleName
            );
            if (relatedSap) return await organelleReceive(relatedSap);
        })
    );
    /**
     * Initial Organelles atttached let roll
     */
    const euglenaHasBeenBorn = particle.cp<common.EuglenaHasBeenBorn>("EuglenaHasBeenBorn");
    const resp = await transmit(
        nucleus.cp("ReceiveParticle", {
            particle: euglenaHasBeenBorn,
            source: endoplasmicReticulumName
        }),
        nucleusName
    );
    if (resp && particle.isParticleClass(resp, "Exception")) throw resp;
};

/**
 * createEuglena
 */
export const ce = createEuglena;
