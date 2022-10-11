import { sys } from "cessnalib";
import { particle, organelle } from "@euglena/template";
import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";

import EuglenaInfo = particle.auth.EuglenaInfo;
import Exception = particle.common.Exception;
import CheckAuthentication = particle.auth.CheckAuthentication;
import CheckAuthorization = particle.auth.CheckAuthorization;
import common = particle.common;

import vacuole = organelle.vacuole;
import bcrypt = organelle.bcrypt;
import nucleus = organelle.nucleus;
import netServer = organelle.netServer;
import Impulse = netServer.Impulse;
import { isParticleClass } from "@euglena/core";

export default dcg<
    Impulse,
    Organelles<{
        vacuole: vacuole.Vacuole;
        bcrypt: bcrypt.Bcrypt;
        nucleus: nucleus.Nucleus;
    }>,
    Parameters<{
        euglenaName: string;
    }>
>("Create EuglenaInfo", { meta: { class: "Impulse" } }, async (p, s, { t, o, params }) => {
    const token = p.data.token as string;
    const operation = p.data.particle;

    //check session
    const checkSession: CheckAuthentication = particle.auth.cp("CheckAuthentication", token);
    const receiveParticle = nucleus.cp("ReceiveParticle", {
        particle: checkSession,
        source: o.nucleus
    });
    const checkSessionResult = (await t(receiveParticle, "nucleus")).data[0] as EuglenaInfo | Exception;
    if (isParticleClass(checkSessionResult, "Exception")) return checkSessionResult;

    //check EuglenaInfo has ability to create EuglenaInfo
    const checkAuthorization: CheckAuthorization = {
        meta: { class: "CheckAuthorization" },
        data: {
            particle: operation.meta.class,
            sender: checkSessionResult
        }
    };
    const receiveParticle2 = nucleus.cp("ReceiveParticle", {
        particle: checkAuthorization,
        source: o.nucleus
    });
    const checkPermissionResult = (await t(receiveParticle2, "nucleus")).data[0] as
        | common.ACK
        | common.NACK
        | Exception;
    if (isParticleClass(checkPermissionResult, "Exception")) return checkPermissionResult;
    if (isParticleClass(checkPermissionResult, "NACK"))
        return common.cp(
            "Exception",
            new sys.type.Exception(
                `Euglena ${checkSessionResult.data.euglenaName} is no permission to send particle ${operation.meta.class} to euglena ${params.euglenaName}`
            )
        );
    return common.cp("ACK");
});
