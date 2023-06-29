import * as cessnalib from "cessnalib";
import { Particle, cp, isParticleClass } from "@euglena/core";
import { vacuole } from "../../store"
import { Encryptor, Compare, Hash, Plain } from "../../../crypt";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Exception } from "../../../../exception.par.h";
import { Boolean } from "../../../../boolean.par.h";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import {GenerateTokenTransmit, generateSession} from "./auth.u";

export type Authenticate = Particle<
    "Authenticate",
    {
        euglenaName: string;
        password: string;
    }
>;

type Organelles = {
    vacuole: vacuole.Vacuole;
    bcrypt: Encryptor;
    jwt: Encryptor;
};

export const createGeneAuthenticate = dcg<
    Pulse<Authenticate>,
    Organelles
>(
    "Authenticate",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "Authenticate" } } } },
    async (pulse, _, { t }) => {
        const {
            data: { euglenaName, password }
        } = pulse.data.particle;
        /**
         * Check username and password is not empty
         */
        if (!euglenaName || !password)
            return cp("Exception", new cessnalib.sys.Exception("Username and password can not be empty"));

        /**
         * Get user info
         *
         */
        const fetchEuglenaInfo = cp<vacuole.ReadParticle>("ReadParticle", {
            query: { meta: { class: "EuglenaInfo" }, data: { euglenaName } },
            count: 1
        });
        const fetchEuglenaInfoResult = await t(fetchEuglenaInfo, "vacuole");
        if (isParticleClass(fetchEuglenaInfoResult, "Exception")) return fetchEuglenaInfoResult;
        const euglenaInfo = fetchEuglenaInfoResult.data[0] as EuglenaInfo;
        if (!euglenaInfo) return cp("Exception", new cessnalib.sys.Exception(`There is no user with ${euglenaName}`));

        /**
         * Check user is active
         */
        if (euglenaInfo.data.status !== "Active")
            return cp("Exception", new cessnalib.sys.Exception(`This user is not Active.`));

        /**
         * Compare Password
         */
        const comparePassword = cp<Compare>("Compare", {
            hash: cp<Hash>("Hash", euglenaInfo.data.password),
            plain: cp<Plain>("Plain", password)
        });
        const encryptPasswordResult = (await t(comparePassword, "bcrypt")) as Boolean | Exception;
        if (isParticleClass(encryptPasswordResult, "Exception")) return encryptPasswordResult;
        if (!encryptPasswordResult.data)
            return cp("Exception", new cessnalib.sys.Exception("Username and password mismatch"));

        /**
         * Generate Token
         */
        return await generateSession<Organelles>(t as GenerateTokenTransmit<Organelles>,euglenaInfo,"vacuole","jwt");
    },
);
