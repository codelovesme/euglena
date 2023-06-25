import * as cessnalib from "cessnalib";
import { cp } from "@euglena/core";
import { genetics } from "../../../../cell";
import { vacuole } from "../../store";
import { EuglenaInfo, Permission, getSenderPermissions } from "../auth";
import { GetMyApi } from "./get-my-api.par.h";
import { Api } from "./api.par.h";
import { Logger } from "../../../../log/logger.org.h";
import { isException } from "../../../../exception.par.u";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import { createOrganelles } from "../../../../cell/genetics";
import { ReadParticle, Vacuole } from "../../store/vacuole";
import { getFirstParticle } from "../../../../particles.par.u";
import { Exception } from "../../../../exception.par.h";
import { Particles } from "../../../../particles.par.h";

type Organelles = createOrganelles<{
    permanentVacuole: vacuole.Vacuole;
    temporaryVacuole: vacuole.Vacuole;
    nucleus: genetics.Nucleus;
    logger: Logger;
}>

export const createGeneGetMyApi = dcg<
    Pulse<GetMyApi>,
    Organelles
>(
    "Get Api",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetMyApi" } } } },
    async (p, s, { t, o }) => {
        const euglenaWhoSendsTheRequest = p.data.sender;
        if (!euglenaWhoSendsTheRequest) return cp<Exception>("Exception", new cessnalib.sys.Exception("The sender is empty"));

        const for_ = p.data.particle.data.for;

        const euglenaInfos = await t(cp<ReadParticle>("ReadParticle", {
            query: { meta: { class: "EuglenaInfo" }, data: { euglenaName: for_ } },
            count: 1
        }), "permanentVacuole") as Particles<EuglenaInfo>;
        if (isException(euglenaInfos)) return euglenaInfos;
        const euglenaWhomPermissionsUnderQuestion = getFirstParticle(euglenaInfos);
        if (!euglenaWhomPermissionsUnderQuestion) return cp<Exception>("Exception", new cessnalib.sys.Exception(`There is no user named: ${for_}`))

        //Read permissons of the euglena
        const permissions = await getSenderPermissions<{ permanentVacuole: Vacuole }>(t, "permanentVacuole", euglenaWhoSendsTheRequest.data.euglenaName, euglenaWhomPermissionsUnderQuestion);
        if (isException(permissions)) return permissions;
        const allowedParticles = permissions.data.reduce((acc, curr) => [...acc, ...(curr as Permission).data.particles], [] as string[])
        return cp<Api>("Api", allowedParticles);
    }
);
