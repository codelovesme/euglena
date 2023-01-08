import * as core from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import { dcg } from "@euglena/organelle.nucleus.js";
import { sys } from "cessnalib";

import vacuole = organelle.vacuole;
import bcrypt = organelle.bcrypt;
import jwt = organelle.jwt;

import auth = particle.auth;
import common = particle.common;

import Particle = core.particle.Particle;
import Pulse = particle.auth.Pulse;

const cp = core.particle.cp;
const isParticleClass = core.particle.isParticleClass;

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
        bcrypt: bcrypt.Bcrypt;
        jwt: jwt.JWT;
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
            return common.cp("Exception", new sys.type.Exception("Username and password can not be empty"));

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
        const euglenaInfo = fetchEuglenaInfoResult.data[0] as auth.EuglenaInfo;
        if (!euglenaInfo) return common.cp("Exception", new sys.type.Exception(`There is no user with ${euglenaName}`));

        /**
         * Check user is active
         */
        if (euglenaInfo.data.status !== "Active")
            return common.cp("Exception", new sys.type.Exception(`This user is not Active.`));

        /**
         * Compare Password
         */
        const encryptPassword = cp<bcrypt.Compare>("Compare", {
            hashedPassword: euglenaInfo.data.password,
            plainPassword: password
        });
        const encryptPasswordResult = (await t(encryptPassword, "bcrypt")) as bcrypt.CompareResult | common.Exception;
        if (isParticleClass(encryptPasswordResult, "Exception")) return encryptPasswordResult;
        if (!encryptPasswordResult.data)
            return common.cp("Exception", new sys.type.Exception("Username and password mismatch"));

        /**
         * Generate Token
         */
        const createdAt = new Date().getTime();
        const expireAt =
            createdAt + sys.type.StaticTools.TimeSpan.toUnixTimestamp(new sys.type.TimeSpan(1, 1, 1, 1, 1));
        const decryptedTokenData: jwt.DecryptedToken["data"] = {
            euglenaName: euglenaName,
            createdAt,
            expireAt,
            type: "Session",
            roles: euglenaInfo.data.roles,
            status: euglenaInfo.data.status
        };
        const generateToken = cp<jwt.GenerateToken>("GenerateToken", decryptedTokenData, {
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
                data: { decryptedToken: { euglenaName: decryptedTokenData.euglenaName } }
            }
        });
        const removeSessionsResult = await t(removeSessions, "vacuole");
        if (isParticleClass(removeSessionsResult, "Exception")) return removeSessionsResult;

        /**
         * Insert session
         */
        const session: auth.Session = cp("Session", {
            decryptedToken: decryptedTokenData,
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
