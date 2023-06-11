import { cp } from "@euglena/core";
import { GeneTransmit, Organelles } from "./genetics";
import { io } from "../sys";

export const getEuglenaName = async <O extends Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: GeneTransmit<O>,
    vacuole: V
) => {
    const getEuglenaName = cp<io.store.vacuole.ReadParticle>("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    return await (t as GeneTransmit)(getEuglenaName, vacuole);
};
