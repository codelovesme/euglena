import { EuglenaInfoV2 } from "./particles";
import { CheckSession } from "./check-session";
import { CheckPermission } from "./check-permission";
import { Hash, HashedPassword } from "../../../bcrypt";
import { ACK, createParticle, Exception, Particle } from "@euglena/core";
import { Impulse } from "../../../net-server";
import { dg } from "../../gene";
import { Organelles, Dependencies, Parameters } from "../../gene.h";
import { ReceiveParticle } from "../../create-organelle-module";
import { SaveParticle } from "../../../vacuole";

export type CreateEuglenaInfo = Particle<"CreateEuglenaInfo", EuglenaInfoV2["data"]>;

export type CreateEuglenaInfoOrganelles = Organelles<{
    vacuole: string;
    bcrypt: string;
}>;

export type CreateEuglenaInfoParameters = Parameters<{
    euglenaName: string;
}>;

export type CreateEuglenaInfoDependencies = Dependencies<CreateEuglenaInfoOrganelles, CreateEuglenaInfoParameters>;

export const createGene = dg<Impulse, CreateEuglenaInfoDependencies>(
    "Create EuglenaInfo",
    { meta: { class: "Impulse" }, data: { particle: { meta: { class: "CreateEuglenaInfo" } } } },
    async (p, s, { t, to, core, cessnalib, params }) => {
        const { isParticleClass, cp } = core;
        const token = p.data.token;
        const createEuglenaInfoParticle = p.data.particle as CreateEuglenaInfo;

        //check session
        const checkSession: CheckSession = cp("CheckSession", token);
        const receiveParticle = createParticle<ReceiveParticle>("ReceiveParticle", {
            particle: checkSession,
            source: "Nucleus"
        });
        const checkSessionResult = (await to.nucleus(receiveParticle)) as EuglenaInfoV2 | Exception;
        if (isParticleClass(checkSessionResult, "Exception")) return checkSessionResult;

        //check EuglenaInfo has ability to create EuglenaInfo
        const checkPermission: CheckPermission = {
            meta: { class: "CheckPermission" },
            data: {
                particle: createEuglenaInfoParticle.meta.class,
                sender: checkSessionResult
            }
        };
        const receiveParticle2 = cp<ReceiveParticle>("ReceiveParticle", {
            particle: checkPermission,
            source: "Nucleus"
        });
        const checkPermissionResult = (await to.nucleus(receiveParticle2)) as ACK | NACK | Exception;
        if (isParticleClass(checkPermissionResult, "Exception")) return checkPermissionResult;
        if (isParticleClass(checkPermissionResult, "NACK"))
            return cp<Exception>(
                "Exception",
                new cessnalib.sys.type.Exception(
                    `Euglena ${checkSessionResult.data.euglenaName} is no permission to send particle ${createEuglenaInfoParticle.meta.class} to euglena ${params.euglenaName}`
                )
            );

        //encrypt given new euglena password
        const encryptPassword = createParticle<Hash>("Hash", createEuglenaInfoParticle.data.password);
        const encryptPasswordResult = (await to.bcrypt(encryptPassword)) as HashedPassword | Exception;
        if (isParticleClass(encryptPasswordResult, "Exception")) return encryptPasswordResult;

        //create euglenainfo object
        const euglenaInfo: EuglenaInfoV2 = {
            meta: { class: "EuglenaInfo", version: "2.0" },
            data: {
                ...createEuglenaInfoParticle.data,
                password: encryptPasswordResult.data
            }
        };

        //store EuglenaInfo object in db
        const saveEuglenaInfo = createParticle<SaveParticle>("SaveParticle", {
            count: 1,
            particle: euglenaInfo
        });
        const saveEuglenaInfoResult = (await to.vacuole(saveEuglenaInfo)) as ACK | Exception;
        if (isParticleClass(saveEuglenaInfoResult, "Exception")) return saveEuglenaInfoResult;

        //return ACK
        return cp<ACK>("ACK");
    }
);
