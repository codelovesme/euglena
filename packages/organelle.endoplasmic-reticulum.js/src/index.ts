import { OrganelleReceive, OrganelleModule, OrganelleTransmit } from "@euglena/organelle";
import { Particle } from "@euglena/particle";
import reticulum from "@euglena/organelle.endoplasmic-reticulum";
import nucleus from "@euglena/organelle.nucleus";
import { ccp } from "@euglena/common";

let organelles: { [organelleName: string]: OrganelleReceive };

const transmit = async (sourceOrganelle: string, particle: Particle, target: string) => {
    if (!target) {
        target = nucleus.n;
        particle = nucleus.cp.incoming.ReceiveParticle(particle, sourceOrganelle);
    }
    const resp = (await organelles[reticulum.n](reticulum.cp.incoming.TransmitParticle(particle, target))) as Particle<
        string,
        Particle
    > | void;
    return resp ? resp.data : undefined;
};

const t: OrganelleTransmit = (particle: Particle, targetOrganelle: string) =>
    transmit(reticulum.n, particle, targetOrganelle);

const attachOrganelle = (
    organelleInfoData: ReturnType<typeof reticulum.cp.incoming.OrganelleInfo>["data"],
    organelles: { [organelleName: string]: OrganelleReceive }
) => {
    switch (organelleInfoData.location.type) {
        case "FileSystemPath":
        case "NodeModules":
        case "Url":
            try {
                const organelle: OrganelleModule = require(organelleInfoData.location.path).default;

                organelles = {
                    ...organelles,
                    [organelleInfoData.nick || organelleInfoData.name]: organelle.co(transmit)
                };
                console.log(`Info - ${organelle.name} attached to the body.`);
                //t(cp.Info(`${organelle.name} attached to the body.`, "Info"));
            } catch (e) {
                console.log(`Error - While attaching ${organelleInfoData.name} : ${e.message}`);
                //t(cp.Info(organelleInfoData.name + " " + e.message, "Error"));
            }
            break;
    }
    return organelles;
};

const reticulumReceive = reticulum.com<{ particles: Particle[]; reticulumReceive: OrganelleReceive }>({
    Sap: async (particle, { cp }) => {
        /**
         * Attach organelles
         */
        const { particles, reticulumReceive } = particle.data;
        const organelleInfos = particles.filter((x) => x.meta.name === "OrganelleInfo") as ReturnType<
            typeof reticulum.cp.incoming.OrganelleInfo
        >[];
        organelles = organelleInfos.reduce((acc, organelleInfo) => attachOrganelle(organelleInfo.data, acc), {
            [reticulum.n]: reticulumReceive
        });
        /**
         * Send their saps
         */
        const organelleSaps = particles.filter((x) => x.meta.name === "Sap") as ReturnType<typeof ccp["Sap"]>[];
        for (const [organelleName, organelleReceive] of Object.entries(organelles)) {
            const relatedSap = organelleSaps.find(
                (x) => (x.meta.organelle.nick || x.meta.organelle.name) === organelleName
            );
            if (relatedSap) organelleReceive(relatedSap);
        }
        /**
         * Initial Organelles atttached let roll
         */
        t(cp.EuglenaHasBeenBorn());
    },
    OrganelleInfo: async (particle) => {
        attachOrganelle(particle.data, organelles);
    },
    TransmitParticle: async (p, { cp }) => {
        const { target, particle } = p.data;
        const organelleReceive: OrganelleReceive = organelles[target];
        if (!organelles) return cp.Log(`Organelle ${reticulum.n} has not been initialized.`, "Error");
        if (!organelleReceive) return cp.Log(`Organelle ${target} has not been connected yet!`, "Error");
        /**
         * send particle to the organelle
         */
        return cp.TransmitResponse(await organelleReceive(particle));
    }
});

export default reticulumReceive;
