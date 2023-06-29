import * as cessnalib from "cessnalib";
import { Particle, cp, isParticleClass } from "@euglena/core";
import { vacuole } from "../../store";
import { genetics } from "../../../../cell";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Permission } from "./permission.par.h";
import { Particles } from "../../../../particles.par.h";
import { Exception } from "../../../../exception.par.h";
import { isException } from "../../../../exception.par.u";
import * as sys from "../../../../sys";
import { ReadParticle, RemoveParticle, SaveParticle, Vacuole } from "../../store/vacuole";
import { getFirstParticle } from "../../../../particles.par.u";
import { ACK } from "../../../../ack.par.h";
import { Encrypt, Encryptor, Hash } from "../../../crypt";
import { Session } from "./session.par.h";

export const getSender = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole | sys.crypt.Encryptor }>>(
    t: any,
    vacuole: cessnalib.ts.KeyForValue<O, Vacuole>,
    jwt: cessnalib.ts.KeyForValue<O, Encryptor>,
    token: string
): Promise<EuglenaInfo | Exception> => {


    //Decode token and check if it fails
    const decryptResult = await t(cp<sys.crypt.Decrypt>("Decrypt", token), jwt) as sys.crypt.Plain | Exception;
    if (isParticleClass(decryptResult, "Exception")) return decryptResult;

    // Fetch token from db (no need token anymore), if session doesn't exist then return error
    const readSession = cp<sys.io.store.vacuole.ReadParticle>("ReadParticle", {
        query: {
            meta: { class: "Session" },
            data: { encryptedToken: token, decryptedToken: { euglenaName: decryptResult.data.euglenaName } }
        },
        count: 1
    });
    const readSessionResult = (await t(readSession, vacuole)) as Particles | Exception;
    if (isParticleClass(readSessionResult, "Exception")) return readSessionResult;
    const sessionParticle = readSessionResult.data[0] as sys.io.net.auth.Session;

    //check if there is session
    if (!sessionParticle)
        return cp<Exception>("Exception", new cessnalib.sys.Exception("Not Authenticated"));

    //Check if session expired
    if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
        return cp<Exception>("Exception", new cessnalib.sys.Exception("Authorization token is expired"));

    //Fetch user
    const fetchUser = cp<sys.io.store.vacuole.ReadParticle>("ReadParticle", {
        count: 1,
        query: {
            meta: { class: "EuglenaInfo" },
            data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
        }
    });
    const fetchUserResult = await t(fetchUser, vacuole) as Exception | Particle<"Particles", Particle[]>;
    if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
    let sender: sys.io.net.auth.EuglenaInfo | undefined = fetchUserResult.data[0] as sys.io.net.auth.EuglenaInfo;
    if (!sender)
        return cp<Exception>(
            "Exception",
            new cessnalib.sys.Exception("There is no user related with this token")
        );
    //check user is active
    if (sender.data.status !== "Active")
        return cp<Exception>("Exception", new cessnalib.sys.Exception("User is not active"));
    return sender;
}

export type GetSenderPermissionsTransmit<O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>> =
    (particle: ReadParticle, organelleName: cessnalib.ts.KeyForValue<O, Vacuole>) => Promise<Particle<"Particles", Particle[]> | Exception>;

export const getSenderPermissions = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>>(
    t: GetSenderPermissionsTransmit<O>,
    vacuole: cessnalib.ts.KeyForValue<O, Vacuole>,
    receiverEuglenaName: string,
    sender?: EuglenaInfo) => {
    const getPermissions = cp<vacuole.ReadParticle>("ReadParticle", {
        query: { meta: { class: "Permission" }, data: { receiverEuglenaName: receiverEuglenaName } },
        count: "all"
    });
    const permissions = await t(getPermissions, vacuole);
    if (isException(permissions)) return permissions;
    //Check if sender is permitted
    const senderPermissionsData = permissions.data.filter(
        (permission) => {
            return permission.data.sender === "*" ||
                (sender &&
                    ("role" in permission.data.sender
                        ? sender.data.roles.includes(permission.data.sender.role)
                        : permission.data.sender.euglenaName == sender.data.euglenaName))
        }
    );
    return cp<Particles>("Particles", senderPermissionsData) as Particles<Permission>;
};

export const getPermission = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>>(
    t: (particle: ReadParticle, organelleName: cessnalib.ts.KeyForValue<O, Vacuole>) => Promise<Particle<"Particles", Particle[]> | Exception>,
    vacuole: cessnalib.ts.KeyForValue<O, Vacuole>,
    sender: Permission["data"]["sender"],
    receiver: Permission["data"]["receiverEuglenaName"]
): Promise<Permission | undefined | Exception> => {
    const getPermissions = cp<vacuole.ReadParticle>("ReadParticle", {
        query: { meta: { class: "Permission" }, data: { sender: sender, receiverEuglenaName: receiver } },
        count: 1
    });
    const permissions = await t(getPermissions, vacuole);
    if (isException(permissions)) return permissions;

    return getFirstParticle(permissions) as Permission | undefined;
}

export const savePermission = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>>(
    t: (particle: SaveParticle, organelleName: cessnalib.ts.KeyForValue<O, Vacuole>) => Promise<ACK | Exception>,
    vacuole: cessnalib.ts.KeyForValue<O, Vacuole>,
    permission: Permission
): Promise<ACK | Exception> => {
    const savePermission = cp<vacuole.SaveParticle>("SaveParticle", {
        query: { meta: { class: "Permission" }, data: { sender: permission.data.sender, receiverEuglenaName: permission.data.receiverEuglenaName } },
        particle: permission,
        count: 1
    });
    return await t(savePermission, vacuole);
}

export const isSenderPermitted = (senderPermissions: Particles<Permission>, particleClass: string) => {
    for (const permission of senderPermissions.data) {
        if (permission.data.particles.includes(particleClass)) {
            return true;
        }
    }
    return false;
}

export type GenerateTokenTransmit<O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole | Encryptor }>> = ((particle: ReadParticle | RemoveParticle | SaveParticle | Encrypt, organelleName: cessnalib.ts.KeyForValue<O, Vacuole> | cessnalib.ts.KeyForValue<O, Encryptor>) => Promise<Particle<"Particles", Particle[]> | Exception> | Promise<Hash> | Promise<ACK | Exception>);

export const generateSession = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole | Encryptor }>>(
    t: GenerateTokenTransmit<O>,
    euglenaInfo: EuglenaInfo,
    vacuole: cessnalib.ts.KeyForValue<O, Vacuole>,
    jwt: cessnalib.ts.KeyForValue<O, Encryptor>,
): Promise<Session | Exception> => {

    /**
     * Generate Token
     */
    const createdAt = new Date().getTime();
    const expireAt =
        createdAt + cessnalib.sys.StaticTools.TimeSpan.toUnixTimestamp(new cessnalib.sys.TimeSpan(1, 1, 1, 1, 1));
    const decryptedToken: Session["data"]["decryptedToken"] = {
        euglenaName: euglenaInfo.data.euglenaName,
        createdAt,
        expireAt,
        type: "Session",
        roles: euglenaInfo.data.roles,
        status: euglenaInfo.data.status
    };
    const generateToken = cp<Encrypt>("Encrypt", decryptedToken, {
        version: "2.0"
    });
    const generateTokenResult = await t(generateToken, jwt) as Hash;

    /**
     * Remove old sessions
     */
    const removeSessions = cp<vacuole.RemoveParticle>("RemoveParticle", {
        count: "all",
        query: {
            meta: { class: "Session" },
            data: { decryptedToken: { euglenaName: decryptedToken.euglenaName } }
        }
    });
    const removeSessionsResult = await t(removeSessions, vacuole) as ACK | Exception;
    if (isParticleClass(removeSessionsResult, "Exception")) return removeSessionsResult;

    /**
     * Insert session
     */
    const session: Session = cp("Session", {
        decryptedToken: decryptedToken,
        encryptedToken: generateTokenResult.data
    });
    const saveSession = cp<vacuole.SaveParticle>("SaveParticle", {
        count: 1,
        particle: session,
        query: {
            meta: { class: "Session" },
            data: { decryptedToken: { euglenaName: euglenaInfo.data.euglenaName } }
        }
    });
    const saveSessionResult = await t(saveSession, vacuole) as ACK | Exception;
    if (isParticleClass(saveSessionResult, "Exception")) return saveSessionResult;

    //Return session
    return session;
} 