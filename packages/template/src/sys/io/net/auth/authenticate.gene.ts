import * as cessnalib from "cessnalib";
import { Particle, cp, isParticleClass } from "@euglena/core";
import { vacuole } from "../../store"
import { Encryptor, Compare, Encrypt, Hash, Plain } from "../../../crypt";
import { EuglenaInfo } from "./euglena-info.par.h";
import { Session } from "./session.par.h";
import { Exception } from "../../../../exception.par.h";
import { Boolean } from "../../../../boolean.par.h";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "./pulse.par.h";

export type Authenticate = Particle<
    "Authenticate",
    {
        euglenaName: string;
        password: string;
    }
>;

export default dcg<
    Pulse<Authenticate>,
    {
        vacuole: vacuole.Vacuole;
        bcrypt: Encryptor;
        jwt: Encryptor;
    }
>(
    "Authenticate",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "Authenticate" } } } },
    async (pulse, s, { t, o }) => {
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
        const createdAt = new Date().getTime();
        const expireAt =
            createdAt + cessnalib.sys.StaticTools.TimeSpan.toUnixTimestamp(new cessnalib.sys.TimeSpan(1, 1, 1, 1, 1));
        const decryptedToken: Session["data"]["decryptedToken"] = {
            euglenaName: euglenaName,
            createdAt,
            expireAt,
            type: "Session",
            roles: euglenaInfo.data.roles,
            status: euglenaInfo.data.status
        };
        const generateToken = cp<Encrypt>("Encrypt", decryptedToken, {
            version: "2.0"
        });
        const generateTokenResult = await t(generateToken, "jwt");

        /**
         * Remove old sessions
         */
        const removeSessions = cp<vacuole.RemoveParticle>("RemoveParticle", {
            count: "all",
            query: {
                meta: { class: "Session" },
                data: { decryptedToken: { euglenaName: decryptedToken.euglenaName } }
            }
        });
        const removeSessionsResult = await t(removeSessions, "vacuole");
        if (isParticleClass(removeSessionsResult, "Exception")) return removeSessionsResult;

        /**
         * Insert session
         */
        const session: Session = cp("Session", {
            decryptedToken: decryptedToken,
            encryptedToken: generateTokenResult.data
        });
        const saveSession = cp<vacuole.SaveParticle>("SaveParticle", {
            count: 1,
            particle: session,
            query: {
                meta: { class: "Session" },
                data: { decryptedToken: { euglenaName } }
            }
        });
        const saveSessionResult = await t(saveSession, "vacuole");
        if (isParticleClass(saveSessionResult, "Exception")) return saveSessionResult;

        //Return session
        return session;
    }
);
