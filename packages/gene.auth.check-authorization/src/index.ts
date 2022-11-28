import { sys } from "cessnalib";
import * as core from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import { dcg } from "@euglena/organelle.nucleus.js";

import vacuole = organelle.vacuole;
import jwt = organelle.jwt;
import nucleus = organelle.nucleus;

import auth = particle.auth;
import common = particle.common;
import AuthenticatedImpulse = auth.AuthenticatedImpulse;
import Permission = auth.Permission;

const cp = core.particle.cp;
const isParticleClass = core.particle.isParticleClass;

/**
 * Checks if sender euglena can have permission to request specified particle to be considered from receiver euglena
 */
export default dcg<
    AuthenticatedImpulse,
    {
        vacuole: vacuole.Vacuole;
        jwt: jwt.JWT;
        nucleus: nucleus.Nucleus;
    }
>(
    "Check Authorization",
    { meta: { class: "AuthenticatedImpulse" } },
    async ({ data: { particle: particleToCheck, sender } }, s, { t, o }) => {
        //read euglenaName
        const readEuglenaName = vacuole.cp("ReadParticle", {
            query: { meta: { class: "EuglenaName" } },
            count: 1
        });
        const readEuglenaNameResult = await t(readEuglenaName, "vacuole");
        if (isParticleClass(readEuglenaNameResult, "Exception")) return readEuglenaNameResult;
        const euglenaNameParticle = particle.common.getParticle(readEuglenaNameResult, "EuglenaName");
        if (!euglenaNameParticle)
            return particle.common.cp(
                "Exception",
                new sys.type.Exception(`There is no EuglenaName stored in ${o.vacuole}`)
            );
        const euglenaName = euglenaNameParticle.data;
        //Read permissons of the euglena
        const readPermissions = cp<vacuole.ReadParticle>("ReadParticle", {
            count: "all",
            query: { meta: { class: "Permission" }, data: { receiverEuglenaName: euglenaName } }
        });
        const readPermissionsResult = await t(readPermissions, "vacuole");
        if (isParticleClass(readPermissionsResult, "Exception")) return readPermissionsResult;
        const permissions = readPermissionsResult.data as Permission[];

        //Check if sender is permitted
        for (const permission of permissions) {
            const relatedPermission =
                "role" in permission.data.sender
                    ? sender.data.roles.includes(permission.data.sender.role)
                    : permission.data.sender.euglenaName == sender.data.euglenaName;
            if (relatedPermission && permission.data.particles.includes(particleToCheck.meta.class)) {
                /**
                 * Send the particle in the impulse to nucleus
                 */
                const receiveParticle3 = nucleus.cp("ReceiveParticle", {
                    particle: particleToCheck,
                    source: o.nucleus
                });
                return await t(receiveParticle3, "nucleus");
            }
        }
        return common.cp("Exception", new sys.type.Exception("Operation is unauthorized"));
    }
);
