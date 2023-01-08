import { sys } from "cessnalib";
import * as core from "@euglena/core";
import { dcg } from "@euglena/organelle.nucleus.js";
import * as template from "@euglena/template";

import vacuole = template.organelle.vacuole;
import jwt = template.organelle.jwt;
import netServer = template.organelle.netServer;
import logger = template.organelle.logger;
import nucleus = template.organelle.nucleus;
import Impulse = netServer.Impulse;
import Permission = template.particle.auth.Permission;
import Particles = template.particle.common.Particles;
import Exception = template.particle.common.Exception;
import EuglenaName = template.particle.common.EuglenaName;
import EuglenaInfo = template.particle.auth.EuglenaInfo;

const isParticleClass = core.particle.isParticleClass;
const isException = template.particle.common.isException;
const getFirstParticle = template.particle.common.getFirstParticle;

export const createGetEuglenaName = (transmit: any, vacuole: { alias: string; name: string }) => async () => {
    const readEuglenaName = template.organelle.vacuole.cp("ReadParticle", {
        query: { meta: { class: "EuglenaName" } },
        count: 1
    });
    const euglenaNames = (await transmit(readEuglenaName, vacuole.alias)) as Particles<EuglenaName> | Exception;
    if (isException(euglenaNames)) return euglenaNames;
    const euglenaName = getFirstParticle(euglenaNames);
    if (!euglenaName) {
        return template.particle.common.cp(
            "Exception",
            new sys.type.Exception(`There is no EuglenaName stored in ${vacuole.name}`)
        );
    }
    return euglenaName;
};

export default dcg<
    Impulse,
    {
        logger: logger.Logger;
        jwt: jwt.JWT;
        permanentVacuole: vacuole.Vacuole;
        temporaryVacuole: vacuole.Vacuole;
        nucleus: nucleus.Nucleus;
    }
>("Handle impulse", { meta: { class: "Impulse" } }, async (p, s, { t, o }) => {
    const { particle, token } = p.data;
    const getEuglenaName = createGetEuglenaName(t, { alias: "temporaryVacuole", name: o.temporaryVacuole });

    const euglenaName = await getEuglenaName();
    if(isException(euglenaName)) return euglenaName;

    //#region function definitions
    const getSenderPermissions = async (sender?: EuglenaInfo) => {
        const getPermissions = vacuole.cp("ReadParticle", {
            query: { meta: { class: "Permission" }, data: { receiverEuglenaName: euglenaName.data } },
            count: 1
        });
        const permissions = (await t(getPermissions, "permanentVacuole")) as Particles<Permission> | Exception;
        if (isException(permissions)) return permissions;
        //Check if sender is permitted
        const senderPermissionsData = permissions.data.filter(
            (permission) =>
                permission.data.sender === "*" ||
                (sender &&
                    ("role" in permission.data.sender
                        ? sender.data.roles.includes(permission.data.sender.role)
                        : permission.data.sender.euglenaName == sender.data.euglenaName))
        );
        return template.particle.common.cp("Particles", senderPermissionsData) as Particles<Permission>;
    };
    const releaseParticle = async (sender?: EuglenaInfo) => {
        const releaseParticle = nucleus.cp("ReceiveParticle", {
            particle: template.particle.auth.cp("Pulse", {
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
        const verifyTokenResult = await t(jwt.cp("VerifyToken", token), "jwt");
        if (isParticleClass(verifyTokenResult, "Exception")) return verifyTokenResult;

        // Fetch token from db (no need token anymore), if session doesn't exist then return error
        const readSession = vacuole.cp("ReadParticle", {
            query: {
                meta: { class: "Session" },
                data: { encryptedToken: token, decryptedToken: { euglenaName: verifyTokenResult.data.euglenaName } }
            },
            count: 1
        });
        const readSessionResult = (await t(readSession, "permanentVacuole")) as Particles | Exception;
        if (isParticleClass(readSessionResult, "Exception")) return readSessionResult;
        const sessionParticle = readSessionResult.data[0] as template.particle.auth.Session;

        //check if there is session
        if (!sessionParticle)
            return template.particle.common.cp("Exception", new sys.type.Exception("Not Authenticated"));

        //Check if session expired
        if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
            return template.particle.common.cp("Exception", new sys.type.Exception("Authorization token is expired"));

        //Fetch user
        const fetchUser = vacuole.cp("ReadParticle", {
            count: 1,
            query: {
                meta: { class: "EuglenaInfo" },
                data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
            }
        });
        const fetchUserResult = await t(fetchUser, "permanentVacuole");
        if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
        sender = fetchUserResult.data[0] as template.particle.auth.EuglenaInfo;
        if (!sender)
            return template.particle.common.cp(
                "Exception",
                new sys.type.Exception("There is no user related with this token")
            );
        //check user is active
        if (sender.data.status !== "Active")
            return template.particle.common.cp("Exception", new sys.type.Exception("User is not active"));
    }

    //Read permissons of the euglena
    const senderPermissions = await getSenderPermissions(sender);
    if (isException(senderPermissions)) return senderPermissions;

    //Check if sender is permitted
    for (const permission of senderPermissions.data) {
        if (permission.data.particles.includes(particle.meta.class)) {
            return await releaseParticle(sender);
        }
    }
    return template.particle.common.cp("Exception", new sys.type.Exception("Operation is unauthorized"));
});
