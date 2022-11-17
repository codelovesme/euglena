import { cp, isParticleClass, Particle } from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";

import vacuole = organelle.vacuole;
import jwt = organelle.jwt;
import nucleus = organelle.nucleus;

import auth = particle.auth;
import common = particle.common;
import AuthenticatedImpulse = auth.AuthenticatedImpulse;
import { sys } from "cessnalib";

export type Permission = Particle<
    "Permission",
    {
        /**
         * Allowed particles to receive
         */
        particles: string[];
        sender:
            | {
                  /**
                   * Role name
                   * Should be unique in the whole database, across the applications
                   * @example
                   * AuthAdmin
                   */
                  role: string;
              }
            | { euglenaName: string };
        receiverEuglenaName: string;
    }
>;

/**
 * Checks if sender euglena can have permission to request specified particle to be considered from receiver euglena
 */
export default dcg<
    AuthenticatedImpulse,
    Organelles<{
        vacuole: vacuole.Vacuole;
        jwt: jwt.JWT;
        nucleus: nucleus.Nucleus;
    }>,
    Parameters<{
        euglenaName: string;
    }>
>(
    "Check Authorization",
    { meta: { class: "AuthenticatedImpulse" } },
    async ({ data: { particle: particleToCheck, sender } }, s, { t, params, o }) => {
        //Read permissons of the euglena
        const readPermissions = cp<vacuole.ReadParticle>("ReadParticle", {
            count: "all",
            query: { meta: { class: "Permission" }, data: { receiverEuglenaName: params.euglenaName } }
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
        return common.cp("Exception",new sys.type.Exception("Operation is unauthorized"));
    }
);