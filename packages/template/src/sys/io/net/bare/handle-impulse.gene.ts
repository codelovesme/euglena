import * as cessnalib from "cessnalib";
import { cp, isParticleClass } from "@euglena/core";
import { getEuglenaName } from "../../../../cell";
import { vacuole } from "../../store";
import { Logger } from "../../../log";
import { Exception, Particles, getFirstParticle, isException } from "../../../../type";
import { genetics } from "../../../../cell";
import { Impulse } from "./impulse.par.h";
import { Decrypt, Encryptor } from "../../../crypt";
import { EuglenaInfo, Permission, Pulse, Session, getSenderPermissions } from "../auth";



export default genetics.dcg<
    Impulse,
    {
        logger: Logger;
        jwt: Encryptor;
        permanentVacuole: vacuole.Vacuole;
        temporaryVacuole: vacuole.Vacuole;
        nucleus: genetics.Nucleus;
    }
>("Handle impulse", { meta: { class: "Impulse" } }, async (p, s, { t, o }) => {
    const { particle, token } = p.data;
    const euglenaName = await getEuglenaName(t, "temporaryVacuole");
    if (isException(euglenaName)) return euglenaName;

    //#region function definitions
    const releaseParticle = async (sender?: EuglenaInfo) => {
        const releaseParticle = cp<genetics.ReceiveParticle>("ReceiveParticle", {
            particle: cp<Pulse>("Pulse", {
                sender: sender,
                particle: particle
            }),
            source: o.nucleus
        });
        return await t(releaseParticle, "nucleus");
    };

    //#endregion functions

    //Check if token exists
    let sender: EuglenaInfo | undefined = undefined;
    if (token) {
        //Decode token and check if it fails
        const decryptResult = await t(cp<Decrypt>("Decrypt", token), "jwt");
        if (isParticleClass(decryptResult, "Exception")) return decryptResult;

        // Fetch token from db (no need token anymore), if session doesn't exist then return error
        const readSession = cp<vacuole.ReadParticle>("ReadParticle", {
            query: {
                meta: { class: "Session" },
                data: { encryptedToken: token, decryptedToken: { euglenaName: decryptResult.data.euglenaName } }
            },
            count: 1
        });
        const readSessionResult = (await t(readSession, "permanentVacuole")) as Particles | Exception;
        if (isParticleClass(readSessionResult, "Exception")) return readSessionResult;
        const sessionParticle = readSessionResult.data[0] as Session;

        //check if there is session
        if (!sessionParticle)
            return cp<Exception>("Exception", new cessnalib.sys.Exception("Not Authenticated"));

        //Check if session expired
        if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
            return cp<Exception>("Exception", new cessnalib.sys.Exception("Authorization token is expired"));

        //Fetch user
        const fetchUser = cp<vacuole.ReadParticle>("ReadParticle", {
            count: 1,
            query: {
                meta: { class: "EuglenaInfo" },
                data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
            }
        });
        const fetchUserResult = await t(fetchUser, "permanentVacuole");
        if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
        sender = fetchUserResult.data[0] as EuglenaInfo;
        if (!sender)
            return cp<Exception>(
                "Exception",
                new cessnalib.sys.Exception("There is no user related with this token")
            );
        //check user is active
        if (sender.data.status !== "Active")
            return cp<Exception>("Exception", new cessnalib.sys.Exception("User is not active"));
    }

    //Read permissons of the euglena
    const senderPermissions = await getSenderPermissions(t, "permanentVacuole", euglenaName, sender);
    if (isException(senderPermissions)) return senderPermissions;

    //Check if sender is permitted
    for (const permission of senderPermissions.data) {
        if (permission.data.particles.includes(particle.meta.class)) {
            return await releaseParticle(sender);
        }
    }
    return cp<Exception>("Exception", new cessnalib.sys.Exception("Operation is unauthorized"));
});
