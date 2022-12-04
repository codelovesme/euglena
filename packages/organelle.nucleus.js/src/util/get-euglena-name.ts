import { GeneTransmit, Organelles } from "../gene.h";
import { organelle } from "@euglena/template";

export const getEuglenaName = async <O extends Organelles, V extends Exclude<keyof O, symbol | number>>(
    t: GeneTransmit<O>,
    vacuole: V
) => {
    const getEuglenaName = organelle.vacuole.cp("ReadParticle", {
        count: 1,
        query: { meta: { class: "EuglenaName" } }
    });
    return await (t as GeneTransmit)(getEuglenaName, vacuole);
};
