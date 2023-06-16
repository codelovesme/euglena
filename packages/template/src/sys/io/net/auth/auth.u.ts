import { cp } from "@euglena/core";
import { vacuole } from "../../store";
import { EuglenaName, genetics } from "../../../../cell";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Permission } from "./permission.par.h";
import { Particles } from "../../../../particles.par.h";
import { Exception } from "../../../../exception.par.h";
import { isException } from "../../../../exception.par.u";

export const getSenderPermissions = async <O extends genetics.createOrganelles<{ [x: string]: vacuole.Vacuole }>, VacuoleName extends Exclude<keyof O, symbol | number>>(
    t: any,
    vacuole: VacuoleName,
    euglenaName: EuglenaName,
    sender?: EuglenaInfo) => {
    const getPermissions = cp<vacuole.ReadParticle>("ReadParticle", {
        query: { meta: { class: "Permission" }, data: { receiverEuglenaName: euglenaName.data } },
        count: 1
    });
    const permissions = await (t as genetics.GeneTransmit)(getPermissions, vacuole) as Particles<Permission> | Exception;
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
    return cp<Particles>("Particles", senderPermissionsData) as Particles<Permission>;
};