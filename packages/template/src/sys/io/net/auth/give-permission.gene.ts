import { Particle, cp } from "@euglena/core";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import { Permission } from "./permission.par.h";
import { Vacuole } from "../../store/vacuole";
import { getPermission, savePermission } from "./auth.u";
import { isException } from "../../../../exception.par.u";

export type GivePermission = Particle<"GivePermission", Permission["data"]>

type Organelles = {
    vacuole: Vacuole
}

export const createGeneGivePermission = dcg<
    Pulse<GivePermission>,
    Organelles
>(
    "Give Perimssion to some other euglena",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "GivePermission" } } } },
    async (p, s, { t, o }) => {
        const { particles, sender, receiverEuglenaName } = p.data.particle.data;
        //get permission
        const permission = await getPermission<Organelles>(t, "vacuole", sender, receiverEuglenaName) || cp<Permission>("Permission", {
            sender,
            receiverEuglenaName,
            particles: []
        });
        if (isException(permission)) return permission;

        //update permission
        permission.data.particles = permission.data.particles.concat(particles);

        //save permission into vacuole
        return await savePermission<Organelles>(t, "vacuole", permission);
    }
);
