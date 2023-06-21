import * as cessnalib from "cessnalib";
import { cp } from "@euglena/core";
import { getEuglenaName } from "../../../../cell";
import { vacuole } from "../../store";
import { Impulse } from "./impulse.par.h";
import { Encryptor } from "../../../crypt";
import { EuglenaInfo, getSender, getSenderPermissions, isSenderPermitted } from "../auth";
import { Logger } from "../../../../log/logger.org.h";
import { isException } from "../../../../exception.par.u";
import { Exception } from "../../../../exception.par.h";
import { createTriggerByClass, dcg } from "../../../../cell/genetics/gene.u";
import { Nucleus } from "../../../../cell/genetics/nucleus.org.h";
import { ReceiveParticle } from "../../../../cell/genetics/receive-particle.par.h";
import { log } from "../../..";
import { Pulse } from "../pulse.par.h";
import { Particles } from "../../../../particles.par.h";
import { getFirstParticle } from "../../../../particles.par.u";
import { Vacuole } from "../../store/vacuole";

/**
 * Checks authorization / permissions
 * then creates a pulse from impulse
 */
export const createGeneHandleImpulse = dcg<
    Impulse,
    {
        logger: Logger;
        jwt: Encryptor;
        permanentVacuole: vacuole.Vacuole;
        temporaryVacuole: vacuole.Vacuole;
        nucleus: Nucleus;
    }
>("Handle impulse", createTriggerByClass("Impulse"), async (p, s, { t, o }) => {
    const { particle, token } = p.data;
    const euglenaName = await getEuglenaName(t, "temporaryVacuole");
    if (!euglenaName) {
        await t(cp<log.Log>("Log", {
            level: "Error",
            message: "No EuglenaName has been set"
        }), "logger")
        return cp<Exception>("Exception", new cessnalib.sys.Exception("Internal server error"))
    }
    if (isException(euglenaName)) return euglenaName;

    //Get sender
    let sender: EuglenaInfo | undefined = undefined;
    if (token) {
        const getSenderResponse = await getSender(t, "permanentVacuole", "jwt", token);
        if (isException(getSenderResponse)) return getSenderResponse;
        sender = getSenderResponse;
    }
    //Read permissons of the euglena
    const senderPermissions = await getSenderPermissions<{ permanentVacuole: Vacuole }>(t, "permanentVacuole", euglenaName.data, sender);
    if (isException(senderPermissions)) return senderPermissions;

    //Check if sender is permitted
    if (isSenderPermitted(senderPermissions, particle.meta.class)) {
        const releaseParticle = cp<ReceiveParticle>("ReceiveParticle", {
            particle: cp<Pulse>("Pulse", {
                sender: sender,
                particle: particle
            }),
            source: o.nucleus
        });
        const response = await t(releaseParticle, "nucleus") as Particles;
        return getFirstParticle(response);
    }
    return cp<Exception>("Exception", new cessnalib.sys.Exception("Operation is unauthorized"));
});
