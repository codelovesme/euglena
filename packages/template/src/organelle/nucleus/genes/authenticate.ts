import { ACK, DecryptedTokenV2, EncryptedToken, Exception, Impulse, Particles } from "../../../particle";
import { CompareResult } from "../../../organelle/bcrypt";
import { dg } from "../../../organelle/nucleus/gene";
import { Dependencies, Parameters, Organelles } from "../../../organelle/nucleus/gene.h";
import { EuglenaInfoV2, Session } from "./particles";
import { Particle } from "@euglena/core";

export type Authenticate = Particle<
    "Authenticate",
    {
        euglenaName: string;
        password: string;
    }
>;

export type AuthenticateOrganelles = Organelles<{
    vacuole: string;
    bcrypt: string;
    jwt: string;
}>;

export type AuthenticateParameters = Parameters<{}>;

export type AuthenticateDependencies = Dependencies<AuthenticateOrganelles, AuthenticateParameters>;

export const createGene = dg<Impulse, AuthenticateDependencies>(
    "Authenticate",
    {
        meta: { class: "Impulse" },
        data: { particle: { meta: { class: "Authenticate" } } }
    },
    async (impulse: Impulse, s, { cessnalib, template, core, to }) => {
        const { sys } = cessnalib;
        const { ccp,vacuole, bcrypt, jwt } = template;
        const { cp, isParticleClass } = core;
        const { euglenaName, password } = impulse.data.particle.data as Authenticate["data"];

        /**
         * Check username and password is not empty
         */
        if (!euglenaName || !password)
            return ccp.Exception(new sys.type.Exception("Username and password can not be empty"));

        /**
         * Get user info
         *
         */
        const fetchEuglenaInfo = vacuole.v1.cp.ReadParticle({
            query: { meta: { class: "EuglenaInfo" }, data: { euglenaName } },
            count: 1
        });
        const fetchEuglenaInfoResult = (await to.vacuole(fetchEuglenaInfo)) as Particles;
        if (isParticleClass(fetchEuglenaInfoResult, "Exception")) return fetchEuglenaInfoResult;
        const euglenaInfo = fetchEuglenaInfoResult.data[0] as EuglenaInfoV2;
        if (!euglenaInfo) return ccp.Exception(new sys.type.Exception(`There is no user with ${euglenaName}`));

        /**
         * Check user is active
         */
        if (euglenaInfo.data.status !== "Active")
            return ccp.Exception(new sys.type.Exception(`This user is not Active.`));

        /**
         * Compare Password
         */
        const encryptPassword = bcrypt.v1.cp.Compare({
            hashedPassword: euglenaInfo.data.password,
            plainPassword: password
        });
        const encryptPasswordResult = (await to.bcrypt(encryptPassword)) as CompareResult | Exception;
        if (isParticleClass(encryptPasswordResult, "Exception")) return encryptPasswordResult;
        if (!encryptPasswordResult.data) return ccp.Exception(new sys.type.Exception("Username and password mismatch"));

        /**
         * Generate Token
         */
        const createdAt = new Date().getTime();
        const expireAt =
            createdAt + sys.type.StaticTools.TimeSpan.toUnixTimestamp(new sys.type.TimeSpan(1, 1, 1, 1, 1));
        const decryptedTokenData: DecryptedTokenV2["data"] = {
            euglenaName: euglenaName,
            createdAt,
            expireAt,
            type: "Session",
            roles: euglenaInfo.data.roles,
            status: euglenaInfo.data.status
        };
        const generateToken = jwt.v2.cp.GenerateToken(decryptedTokenData, { version: "2.0" });
        const generateTokenResult = (await to.jwt(generateToken)) as EncryptedToken | Exception;
        if (isParticleClass(generateTokenResult, "Exception")) return generateTokenResult;

        /**
         * Insert session
         */
        const session: Session = cp("Session", {
            decryptedToken: decryptedTokenData,
            encryptedToken: generateTokenResult.data
        });
        const saveSession = vacuole.v1.cp.SaveParticle({
            count: 1,
            particle: session,
            query: {
                meta: { class: "Session" },
                data: { euglenaName }
            }
        });
        const saveSessionResult = (await to.vacuole(saveSession)) as ACK | Exception;
        if (isParticleClass(saveSessionResult, "Exception")) return saveSessionResult;

        //Return session
        return session;
    }
);
