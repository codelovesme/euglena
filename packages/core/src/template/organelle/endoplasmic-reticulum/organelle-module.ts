import { endoplasmicReticulum as reticulum } from "./create-organelle-module";
import { P, Sap } from "../../../organelle/particles.h";
import { OrganelleReceive, OrganelleTransmit } from "../../../organelle/organelle-receive.h";
import { Particle } from "../../../particle";
import { nucleus, nucleusJs } from "../nucleus";
import { OrganelleModule } from "../../../organelle/organelle-module.h";

const endoplasmicReticulumName: "EndoplasmicReticulum" = "EndoplasmicReticulum";

let organelles: { [organelleName: string]: OrganelleReceive };

const nucleusJsName: string = "Nucleus";

const transmit = async (source: string, particle: Particle, target?: string) => {
    if (!target) {
        target = nucleusJsName;
        particle = await nucleus.cp.ReceiveParticle({ particle, source });
    }
    const resp = (await organelles[endoplasmicReticulumName](
        reticulum.cp.TransmitParticle({ particle, target: target! })
    )) as Particle<string, Particle> | void;
    return resp ? resp.data : undefined;
};

const t: OrganelleTransmit = (particle: Particle) => transmit(endoplasmicReticulumName, particle);

const attachOrganelle = async (
    organelleInfoData: ReturnType<typeof reticulum.cp.OrganelleInfo>["data"]
): Promise<void> => {
    let organelle: OrganelleModule<Sap> | undefined;
    switch (organelleInfoData.location.type) {
        case "FileSystemPath":
        case "NodeModules":
        case "Url":
            try {
                organelle = (await import(organelleInfoData.location.path)).default;

                //t(cp.Info(`${organelle.name} attached to the body.`, "Info"));
            } catch (e:any) {
                console.log(`Error - While attaching ${organelleInfoData.name} : ${e.message}`);
                //t(cp.Info(organelleInfoData.name + " " + e.message, "Error"));
            }
            break;
        case "InMemory":
            organelle = organelleInfoData.location.organelle;

            break;
    }
    if (organelle) {
        organelles = {
            ...organelles,
            [organelleInfoData.name]: organelle.co({ name: organelleInfoData.name, transmit })
        };
        console.log(`Info - ${organelleInfoData.name} attached to the body.`);
    }
};

const endoplasmicReticulumJs = reticulum.com<P<{ particles: Particle[]; reticulumReceive: OrganelleReceive }>>({
    Sap: async (particle, { cp }) => {
        /**
         * Attach organelles
         */
        const { particles, reticulumReceive } = particle.data;
        const organelleInfos = particles.filter((x) => x.meta.class === "OrganelleInfo") as ReturnType<
            typeof reticulum.cp.OrganelleInfo
        >[];
        organelles = {
            [endoplasmicReticulumName]: reticulumReceive as any,
            [nucleusJsName]: nucleusJs.co({ transmit })
        };
        for (let { data } of organelleInfos) {
            await attachOrganelle(data);
        }
        /**
         * Send their saps
         */

        const organelleSaps = particles.filter((x) => x.meta.class === "Sap") as Particle<
            "Sap",
            Sap["data"],
            Sap["adds"]
        >[];
        for (const [organelleName, organelleReceive] of Object.entries(organelles)) {
            const relatedSap = organelleSaps.find((x) => x.meta.organelleName === organelleName);
            if (relatedSap) organelleReceive(relatedSap);
        }
        /**
         * Initial Organelles atttached let roll
         */
        t(cp.EuglenaHasBeenBorn(undefined));
    },
    OrganelleInfo: async (particle) => {
        attachOrganelle(particle.data);
    },
    TransmitParticle: async (p, { cp }) => {
        const { target, particle } = p.data;
        if (!organelles)
            return cp.Log({
                message: `Organelle ${endoplasmicReticulumName} has not been initialized.`,
                level: "Error"
            });
        const organelleReceive: OrganelleReceive = organelles[target];
        if (!organelleReceive)
            return cp.Log({ message: `Organelle ${target} has not been connected yet!`, level: "Error" });
        /**
         * send particle to the organelle
         */
        // t(
        //     cp.Log({
        //         message: `Transmitting particle ${JSON.stringify(particle.meta)} to ${target}`,
        //         level: "Info"
        //     })
        // );
        const resp = await organelleReceive(particle);
        return cp.TransmitResponse(resp);
    }
});

export { endoplasmicReticulumJs };
