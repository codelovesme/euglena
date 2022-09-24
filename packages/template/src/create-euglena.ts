import { cp, CreateOrganelle, OrganelleReceive, Particle } from "@euglena/core";
import { TransmitParticle } from "./organelle/endoplasmic-reticulum";
import { ReceiveParticle } from "./organelle/nucleus";
import { OrganelleInfo, Sap } from "./particle/particle.h";
// import { endoplasmicReticulumJs, Sap } from "./organelle/endoplasmic-reticulum";

const endoplasmicReticulumName = "EndoplasmicReticulum";
const nucleusName = "Nucleus";

const organelles: { [organelleName: string]: OrganelleReceive } = {};

export const getOrganelles = () => organelles;

export const reviveOrganelle = async ({ data }: OrganelleInfo) => {
    let organelle: CreateOrganelle<Particle, void | Particle> | undefined;
    switch (data.location.type) {
        case "FileSystemPath":
        case "NodeModules":
        case "Url":
            try {
                organelle = (await import(data.location.path)).default;

                //t(cp.Info(`${organelle.name} attached to the body.`, "Info"));
            } catch (e: any) {
                console.log(`Error - While attaching ${data.name} : ${e.message}`);
                //t(cp.Info(organelleInfoData.name + " " + e.message, "Error"));
            }
            break;
        case "InMemory":
            organelle = data.location.organelle;
            break;
    }
    return organelle;
};

export const attachOrganelle = async (organelleInfo: OrganelleInfo, transmit: any): Promise<void> => {
    let createOrganelle = await reviveOrganelle(organelleInfo);
    const { data: organelleInfoData } = organelleInfo;
    if (createOrganelle) {
        organelles[organelleInfoData.name] = await createOrganelle({ name: organelleInfoData.name, transmit });
        console.log(`Info - ${organelleInfoData.name} attached to the body.`);
    }
};

const transmit = async (source: string, particle: Particle, target?: string) => {
    if (!target) {
        target = nucleusName;
        particle = cp<ReceiveParticle>("ReceiveParticle", { particle, source });
    }
    const resp = (await organelles[endoplasmicReticulumName]!(
        cp<TransmitParticle>("TransmitParticle", { particle, target: target! })
    )) as Particle<string, Particle> | void;
    return resp ? resp.data : undefined;
};

export const createEuglena = async (particles: Particle[]) => {
    /**
     * Attach organelles
     */
    const organelleInfos = particles.filter((x) => x.meta.class === "OrganelleInfo") as OrganelleInfo[];
    for (const organelleInfo of organelleInfos) {
        await attachOrganelle(organelleInfo, transmit);
    }
    /**
     * Send their saps
     */

    await Promise.all(
        Object.entries(organelles).map(async ([organelleName, organelleReceive]) => {
            const relatedSap = particles.find(
                (x) => x.meta.class === "Sap" && (x as Sap).meta.organelleName === organelleName
            );
            if (relatedSap) return await organelleReceive(relatedSap);
        })
    );
    /**
     * Initial Organelles atttached let roll
     */
    // t(cp<EuglenaHasBeenBorn>("EuglenaHasBeenBorn"));
};

/**
 * createEuglena
 */
export const ce = createEuglena;
