import { cp } from "@euglena/core";
import { genetics, getEuglenaName } from "../../../../cell";
import { vacuole } from "../../store";
import { Permission, Pulse, getSenderPermissions } from "../auth";
import { GetApi } from "./get-api.par.h";
import { Api } from "./api.par.h";
import { Logger } from "../../../../log/logger.org.h";
import { isException } from "../../../../exception.par.u";
import { Log } from "../../../../log/log.par.h";

export const createGeneGetApi = genetics.dcg<
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
        //read euglenaName
        const euglenaName = await getEuglenaName(t, "temporaryVacuole");
        if (isException(euglenaName)) return euglenaName;

        //log euglenaName
        await t(cp<Log>("Log", { message: `EuglenaName: ${euglenaName.data}`, level: "Info" }), "logger");

        //Read permissons of the euglena
        const permissions = await getSenderPermissions(t, "permanentVacuole", euglenaName, p.data.sender);
        if (isException(permissions)) return permissions;
        const allowedParticles = permissions.data.reduce((acc, curr) => [...acc, ...(curr as Permission).data.particles], [] as string[])
        return cp<Api>("Api", allowedParticles);
    }
);
