import { Particle, cp } from "@euglena/core";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import { Permission } from "./permission.par.h";
import { Vacuole } from "../../store/vacuole";
import { isException } from "../../../../exception.par.u";
import { vacuole } from "../../store";
import { Particles } from "../../../../particles.par.h";

export type GetPermissions = Particle<"GetPermissions", {
    /**
     * euglena name
     */
    of: string;
}>

type Organelles = {
    vacuole: Vacuole
}

export const createGeneGetPermissions = dcg<
    Pulse<GetPermissions>,
    Organelles
>(
    "Give Perimssion to some other euglena",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GetPermissions" } } } },
    async (p, s, { t, o }) => {
        const sender = p.data.sender;
        const permissions: Permission[] = [];
        if (sender) {
            /**
             * Permissions based on name
             */
            const getPermissionsBasedOnName = cp<vacuole.ReadParticle>("ReadParticle", {
                query: { meta: { class: "Permission" }, data: { sender: { euglenaName: sender.data.euglenaName } } },
                count: "all"
            });
            const result1 = await t(getPermissionsBasedOnName, "vacuole");
            if (isException(result1)) result1;
            permissions.push(...result1.data as Permission[]);
            /**
             * Permissions based on role
            */
            for (const role of sender.data.roles) {
                const getPermissionsBasedOnRole = cp<vacuole.ReadParticle>("ReadParticle", {
                    query: { meta: { class: "Permission" }, data: { sender: { role: role } } },
                    count: "all"
                });
                const result2 = await t(getPermissionsBasedOnRole, "vacuole");
                if (isException(result2)) result2;
                permissions.push(...result2.data as Permission[]);
            }
        }
        /**
         * Permissions for public
        */
        const getPermissionsForAll = cp<vacuole.ReadParticle>("ReadParticle", {
            query: { meta: { class: "Permission" }, data: { sender: "*" } },
            count: "all"
        });
        const result3 = await t(getPermissionsForAll, "vacuole");
        if (isException(result3)) return result3;
        permissions.push(...result3.data as Permission[]);


        return cp<Particles>("Particles", permissions) as Particles<Permission>;
    }
);
