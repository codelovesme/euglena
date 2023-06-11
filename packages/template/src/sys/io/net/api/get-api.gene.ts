import { cp } from "@euglena/core";
import { genetics } from "../../../../cell";
import { isException } from "../../../../type";
import { Log, Logger } from "../../../log";
import { vacuole } from "../../store";
import { Pulse } from "../auth";
import { createGetEuglenaName } from "../bare/handle-impulse.gene";
import { GetApi } from "./get-api.par.h";
import { Api } from "./api.par.h";
import { vacuole } from "../../store";

const getSenderPermissions = (sender: string) => {
    return
}

export default genetics.dcg<
    Pulse<GetApi>,
    {
        permanentVacuole: vacuole.Vacuole;
        temporaryVacuole: vacuole.Vacuole;
        nucleus: genetics.Nucleus;
        logger: Logger;
    }
>(
    "Get Api",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetApi" } } } },
    async (p, s, { t, o }) => {
        const getEuglenaName = createGetEuglenaName(t, { alias: "temporaryVacuole", name: o.temporaryVacuole });
        //read euglenaName
        const euglenaName = await getEuglenaName();
        if (isException(euglenaName)) return euglenaName;

        //log euglenaName
        await t(cp<Log>("Log", { message: `EuglenaName: ${euglenaName.data}`, level: "Info" }), "logger");

        //Read permissons of the euglena
        t(cp<vacuole.ReadParticle>("ReadParticle",{
            count:"all",
            query: {}
        }), o.permanentVacuole)
        const permissions = await getSenderPermissions(p.data.sender);
        if (isException(permissions)) return permissions;
        return cp<Api>(
            "Api",
            permissions.data.reduce((acc, curr) => [...acc, ...curr.data.particles], [] as Particle[])
        );
    }
);
