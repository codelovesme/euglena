import { cp, createParticle, isParticleClass } from "@euglena/core";
import { Encrypt, Encryptor, Hash } from "../../../crypt";
import { vacuole } from "../../store";
import { CreateEuglenaInfo } from "./create-euglena-info.par.h";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Exception } from "../../../../exception.par.h";
import { ACK } from "../../../../ack.par.h";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Nucleus } from "../../../../cell/genetics/nucleus.org.h";


export default dcg<
    CreateEuglenaInfo,
    {
        vacuole: vacuole.Vacuole;
        bcrypt: Encryptor;
        nucleus: Nucleus;
    }
>("Create EuglenaInfo", { meta: { class: "CreateEuglenaInfo" } }, async (p, s, { t, o }) => {
    //encrypt given new euglena password
    const encryptPassword = createParticle<Encrypt>("Encrypt", p.data.password);
    const encryptPasswordResult = (await t(encryptPassword, "bcrypt")) as Hash | Exception;
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
    const saveEuglenaInfoResult = (await t(saveEuglenaInfo, "vacuole")) as ACK | Exception;
    if (isParticleClass(saveEuglenaInfoResult, "Exception")) return saveEuglenaInfoResult;

    //return ACK
    return cp<ACK>("ACK");
});
