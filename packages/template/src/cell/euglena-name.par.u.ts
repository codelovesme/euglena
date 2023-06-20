import * as cessnalib from "cessnalib";
import { cp } from "@euglena/core";
import { GeneTransmit, Organelles } from "./genetics";
import { io } from "../sys";
import { EuglenaName } from "./euglena-name.par.h";
import { Exception } from "../exception.par.h";
import { Particles } from "../particles.par.h";
import { isException } from "../exception.par.u";
import { getFirstParticle } from "../particles.par.u";

export const getEuglenaName = async <O extends Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: any,
    vacuole: V
): Promise<EuglenaName | Exception> => {
    const getEuglenaName = cp<io.store.vacuole.ReadParticle>("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    const euglenaNames = await (t as GeneTransmit)(getEuglenaName, vacuole) as Particles<EuglenaName> | Exception;
    if (isException(euglenaNames)) return euglenaNames;
    const euglenaName = getFirstParticle(euglenaNames);
    if (!euglenaName) {
        return cp<Exception>("Exception", new cessnalib.sys.Exception(`There is no EuglenaName stored in ${vacuole}`));
    }
    return euglenaName;
};