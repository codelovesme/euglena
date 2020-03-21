import { nucleus, OrganelleReceive, OrganelleModule, OrganelleTransmit, P, Sap } from "..";
import { Particle } from "../../particle";
import reticulum from "./create-organelle-module";
import { nucleusJs } from "../nucleus";

let organelles: { [organelleName: string]: OrganelleReceive };

const transmit = async (source: string, particle: Particle, target?: string) => {
    if (!target) {
        target = nucleus.n;
        particle = nucleus.cp.incoming.ReceiveParticle({ particle, source });
    }
    const resp = (await organelles[reticulum.n](
        reticulum.cp.incoming.TransmitParticle({ particle, target })
    )) as Particle<string, Particle> | void;
    return resp ? resp.data : undefined;
};

const t: OrganelleTransmit = (particle: Particle) => transmit(reticulum.n, particle);

const attachOrganelle = async (
    organelleInfoData: ReturnType<typeof reticulum.cp.incoming.OrganelleInfo>["data"]
): Promise<void> => {
    let organelle: OrganelleModule | undefined;
    switch (organelleInfoData.location.type) {
        case "FileSystemPath":
        case "NodeModules":
        case "Url":
            try {
                organelle = (await import(organelleInfoData.location.path)).default;

                //t(cp.Info(`${organelle.name} attached to the body.`, "Info"));
            } catch (e) {
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
            [organelleInfoData.nick || organelleInfoData.name]: organelle.co(transmit)
        };
        console.log(`Info - ${organelleInfoData.nick || organelleInfoData.name} attached to the body.`);
    }
};

export default reticulum.com<
    P<{ particles: Particle[]; reticulumReceive: OrganelleReceive }, { organelle: { name: string; nick?: string } }>
>({
    Sap: async (particle, { cp }) => {
        /**
         * Attach organelles
         */
        const { particles, reticulumReceive } = particle.data;
        const organelleInfos = particles.filter((x) => x.meta.class === "OrganelleInfo") as ReturnType<
            typeof reticulum.cp.incoming.OrganelleInfo
        >[];
        organelles = {
            [reticulum.n]: reticulumReceive,
            [nucleus.n]: nucleusJs.createOrganelle(transmit)
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
            const relatedSap = organelleSaps.find(
                (x) => (x.meta.organelle.nick || x.meta.organelle.name) === organelleName
            );
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
            return cp.Log({ message: `Organelle ${reticulum.n} has not been initialized.`, level: "Error" });
        const organelleReceive: OrganelleReceive = organelles[target];
        if (!organelleReceive)
            return cp.Log({ message: `Organelle ${target} has not been connected yet!`, level: "Error" });
        /**
         * send particle to the organelle
         */
        const resp = await organelleReceive(particle);
        return cp.TransmitResponse(resp);
    }
});
