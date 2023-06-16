import { cp } from "@euglena/core";
import { GeneTransmit, Organelles } from "./genetics";
import { io } from "../sys";
import { EuglenaName } from "./euglena-name.par.h";
import { Exception } from "../exception.par.h";

export const getEuglenaName = async <O extends Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: any,
    vacuole: V
):Promise<EuglenaName | Exception> => {
    const getEuglenaName = cp<io.store.vacuole.ReadParticle>("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    return await (t as GeneTransmit)(getEuglenaName, vacuole) as EuglenaName | Exception;
};
