import { Particle } from "@euglena/core";
import { DecryptedToken, Exception, Particles } from "../../../particle";
import { dg } from "../../nucleus";
import { Dependencies, Parameters, Organelles } from "../gene.h";
import { Session, EuglenaInfoV2 } from "./particles";

export type CheckSession = Particle<"CheckSession", string>;

export type CheckSessionOrganelles = Organelles<{
    jwt: string;
    vacuole: string;
}>;
export type CheckSessionParameters = Parameters<{}>;
export type CheckSessionDependencies = Dependencies<CheckSessionOrganelles, CheckSessionParameters>;

/**
 * Checks if the token valid and session is there
 * Then returns user
 */
export const createGeneCheckSession = dg<CheckSession, CheckSessionDependencies>(
    "Check session",
    { meta: { class: "CheckSession" } },
    async ({ data: token }, s, { to, template, core, cessnalib }) => {
        const { vacuole, jwt } = template;
        const { ccp } = template;
        const { isParticleClass } = core;
        const { sys } = cessnalib;

        //Check if token exists
        if (!token) return ccp.Exception(new sys.type.Exception("There is no token"));

        //Decode token and check if it fails
        const verifyTokenResult = (await to.jwt(jwt.v1.cp.VerifyToken(token))) as DecryptedToken | Exception;
        if (isParticleClass(verifyTokenResult, "Exception")) return verifyTokenResult;

        // Fetch token from db (no need token anymore), if session doesn't exist then return error
        const readSession = vacuole.v1.cp.ReadParticle({
            query: {
                meta: { class: "Session" },
                data: { encryptedToken: token, decryptedToken: { euglenaName: verifyTokenResult.data.euglenaName } }
            },
            count: 1
        });
        const readSessionResult = (await to.vacuole(readSession)) as Particles | Exception;
        if (isParticleClass(readSessionResult, "Exception")) return readSessionResult;
        const sessionParticle = readSessionResult.data[0] as Session;

        //check if there is session
        if (!sessionParticle) return ccp.Exception(new sys.type.Exception("Not Authenticated"));

        //Check if session expired
        if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
            return ccp.Exception(new sys.type.Exception("Authorization token is expired"));

        //Fetch user
        const fetchUser = vacuole.v1.cp.ReadParticle({
            count: 1,
            query: {
                meta: { class: "EuglenaInfo" },
                data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
            }
        });
        const fetchUserResult = (await to.vacuole(fetchUser)) as Particles | Exception;
        if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
        const userParticle = fetchUserResult.data[0] as EuglenaInfoV2;
        if (!userParticle) return ccp.Exception(new sys.type.Exception("There is no user related with this token"));

        //check user is active
        if (userParticle.data.status !== "Active") return ccp.Exception(new sys.type.Exception("User is not active"));

        //return user
        return fetchUserResult;
    }
);
