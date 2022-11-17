import { particle, organelle } from "@euglena/template";
import { dcg, Organelles, Parameters } from "@euglena/organelle.nucleus.js";

import EuglenaInfo = particle.auth.EuglenaInfo;
import CreateEuglenaInfo = particle.auth.CreateEuglenaInfo;
import common = particle.common;
import vacuole = organelle.vacuole;
import bcrypt = organelle.bcrypt;
import nucleus = organelle.nucleus;
import { createParticle, isParticleClass } from "@euglena/core";

export default dcg<
    CreateEuglenaInfo,
    Organelles<{
        vacuole: vacuole.Vacuole;
        bcrypt: bcrypt.Bcrypt;
        nucleus: nucleus.Nucleus;
    }>,
    Parameters<{
        euglenaName: string;
    }>
>("Create EuglenaInfo", { meta: { class: "CreateEuglenaInfo" } }, async (p, s, { t, o, params }) => {
    //encrypt given new euglena password
    const encryptPassword = createParticle<bcrypt.Hash>("Hash", p.data.password);
    const encryptPasswordResult = (await t(encryptPassword, "bcrypt")) as bcrypt.HashedPassword | common.Exception;
    if (isParticleClass(encryptPasswordResult, "Exception")) return encryptPasswordResult;

    //create euglenainfo object
    const euglenaInfo: EuglenaInfo = {
        meta: { class: "EuglenaInfo", version: "2.0" },
        data: {
            ...p.data,
            password: encryptPasswordResult.data
        }
    };

    //store EuglenaInfo object in db
    const saveEuglenaInfo = createParticle<vacuole.SaveParticle>("SaveParticle", {
        count: 1,
        particle: euglenaInfo
    });
    const saveEuglenaInfoResult = (await t(saveEuglenaInfo, "vacuole")) as common.ACK | common.Exception;
    if (isParticleClass(saveEuglenaInfoResult, "Exception")) return saveEuglenaInfoResult;

    //return ACK
    return common.cp("ACK");
});