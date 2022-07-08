import { Particle } from "@euglena/core";
import { Particles, Exception } from "../../../../particle";
import { dg, Organelles, Parameters } from "../../../nucleus";
import { Dependencies } from "../../gene.h";
import { EuglenaInfoV2 } from "./particles";

export type CheckPermission = Particle<
    "CheckPermission",
    {
        sender: EuglenaInfoV2;
        particle: string;
    }
>;

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

export type CheckPermissionOrganelles = Organelles<{
    jwt: string;
    vacuole: string;
}>;

export type CheckPermissionParameters = Parameters<{
    euglenaName: string;
}>;
export type CheckPermissionDependencies = Dependencies<CheckPermissionOrganelles, CheckPermissionParameters>;
/**
 * Checks if sender euglena can have permission to request specified particle to be considered from receiver euglena
 */
export const createGeneCheckPermission = dg<CheckPermission, CheckPermissionDependencies>(
    "Check Permission",
    { meta: { class: "CheckPermission" } },
    async ({ data: { particle: particleToCheck, sender } }, s, { to, params, template, core }) => {
        const { vacuole,ccp } = template;
        const { isParticleClass } = core;

        //Read permissons of the euglena
        const readPermissions = vacuole.v1.cp.ReadParticle({
            count: "all",
            query: { meta: { class: "Permission" }, data: { receiverEuglenaName: params.euglenaName } }
        });
        const readPermissionsResult = (await to.vacuole(readPermissions)) as Particles | Exception;
        if (isParticleClass(readPermissionsResult, "Exception")) readPermissionsResult;
        const permissions = readPermissionsResult.data as Permission[];

        //Check if sender is permitted
        for (const permission of permissions) {
            const relatedPermission =
                "role" in permission.data.sender
                    ? sender.data.roles.includes(permission.data.sender.role)
                    : permission.data.sender.euglenaName == sender.data.euglenaName;
            if (relatedPermission && permission.data.particles.includes(particleToCheck)) return ccp.ACK();
        }
        return ccp.NACK();
    }
);
