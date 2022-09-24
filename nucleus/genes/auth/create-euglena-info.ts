import { EuglenaInfoV2 } from "./particles";
import { CheckSession } from "./check-session";
import { CheckPermission } from "./check-permission";
import { Hash, HashedPassword } from "../../../bcrypt";
import { ACK, ccp, cp, createParticle, Exception, isParticleClass, Particle } from "@euglena/core";
import { Impulse } from "../../../net-server";
import { dg } from "../../gene";
import { Organelles as O, Parameters as P } from "../../gene.h";
import { ReceiveParticle } from "../../create-organelle-module.h";
import { SaveParticle } from "../../../vacuole";
import { sys } from "cessnalib";
import { bcrypt, nucleus, vacuole } from "../../..";

export type CreateEuglenaInfo = Particle<"CreateEuglenaInfo", EuglenaInfoV2["data"]>;

export type Organelles = O<{
    vacuole: vacuole.Vacuole;
    bcrypt: bcrypt.Bcrypt;
    nucleus: nucleus.Nucleus;
}>;

export type Parameters = P<{
    euglenaName: string;
}>;

export const createGene = dg<Impulse, Organelles, Parameters>(
    "Create EuglenaInfo",
    { meta: { class: "Impulse" }, data: { particle: { meta: { class: "CreateEuglenaInfo" } } } },
    async (p, s, { t, o, params }) => {
        const token = p.data.token;
        const createEuglenaInfoParticle = p.data.particle as CreateEuglenaInfo;

        //check session
        const checkSession: CheckSession = cp<CheckSession>("CheckSession", token);
        const receiveParticle = cp<ReceiveParticle>("ReceiveParticle", {
            particle: checkSession,
            source: o.nucleus
        });
        const checkSessionResult = (await t(receiveParticle, "nucleus")) as EuglenaInfoV2 | Exception;
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
            source: o.nucleus
        });
        const checkPermissionResult = (await t(receiveParticle2,"nucleus")) as ACK | Exception;
        if (isParticleClass(checkPermissionResult, "Exception")) return checkPermissionResult;
        if (isParticleClass(checkPermissionResult, "NACK"))
            return ccp.Exception(
                new sys.type.Exception(
                    `Euglena ${checkSessionResult.data.euglenaName} is no permission to send particle ${createEuglenaInfoParticle.meta.class} to euglena ${params.euglenaName}`
                )
            );

        //encrypt given new euglena password
        const encryptPassword = createParticle<Hash>("Hash", createEuglenaInfoParticle.data.password);
        const encryptPasswordResult = (await t(encryptPassword,"bcrypt")) as HashedPassword | Exception;
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
        const saveEuglenaInfoResult = (await t(saveEuglenaInfo,"vacuole")) as ACK | Exception;
        if (isParticleClass(saveEuglenaInfoResult, "Exception")) return saveEuglenaInfoResult;

        //return ACK
        return ccp.ACK();
    }
);
