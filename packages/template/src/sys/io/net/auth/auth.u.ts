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
import { ReadParticle, SaveParticle, Vacuole } from "../../store/vacuole";
import { KeyForValue } from "cessnalib/dist/ts";
import { getFirstParticle } from "../../../../particles.par.u";
import { ACK } from "../../../../ack.par.h";

export const getSender = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole | sys.crypt.Encryptor }>, VacuoleName extends Exclude<keyof O, symbol | number>, JWTName extends Exclude<keyof O, symbol | number>>(
    t: any,
    vacuole: VacuoleName,
    jwt: JWTName,
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

export const getSenderPermissions = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>>(
    t: (particle: ReadParticle , organelleName: KeyForValue<O, Vacuole>) => Promise<Particle<"Particles", Particle[]> | Exception>,
    vacuole: KeyForValue<O, Vacuole>,
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
    t: (particle: ReadParticle, organelleName: KeyForValue<O, Vacuole>) => Promise<Particle<"Particles", Particle[]> | Exception>,
    vacuole: KeyForValue<O, Vacuole>,
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
    t: (particle: SaveParticle, organelleName: KeyForValue<O, Vacuole>) => Promise<ACK | Exception>,
    vacuole: KeyForValue<O, Vacuole>,
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