import { common.cp, cp, Exception, isParticleClass, Particle } from "@euglena/core";
import { sys } from "cessnalib";
import { Particles } from "../../../../utils/particles";
import { DecryptedToken, VerifyToken } from "../../../jwt";
import { dg } from "../../../nucleus";
import { ReadParticle } from "../../../vacuole";
import { Dependencies, Parameters, Organelles } from "../../gene.h";
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
    async ({ data: token }, s, { to }) => {
        //Check if token exists
        if (!token) return cp<Exception>("Exception", new sys.type.Exception("There is no token"));

        //Decode token and check if it fails
        const verifyTokenResult = (await to.jwt(cp<VerifyToken>("VerifyToken", token))) as DecryptedToken | Exception;
        if (isParticleClass(verifyTokenResult, "Exception")) return verifyTokenResult;

        // Fetch token from db (no need token anymore), if session doesn't exist then return error
        const readSession = cp<ReadParticle>("ReadParticle", {
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
        if (!sessionParticle) return common.cp.Exception(new sys.type.Exception("Not Authenticated"));

        //Check if session expired
        if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
            return common.cp.Exception(new sys.type.Exception("Authorization token is expired"));

        //Fetch user
        const fetchUser = cp<ReadParticle>("ReadParticle", {
            count: 1,
            query: {
                meta: { class: "EuglenaInfo" },
                data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
            }
        });
        const fetchUserResult = (await to.vacuole(fetchUser)) as Particles | Exception;
        if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
        const userParticle = fetchUserResult.data[0] as EuglenaInfoV2;
        if (!userParticle) return common.cp.Exception(new sys.type.Exception("There is no user related with this token"));

        //check user is active
        if (userParticle.data.status !== "Active") return common.cp.Exception(new sys.type.Exception("User is not active"));

        //return user
        return fetchUserResult;
    }
);
function VerifyToken(token: string): any {
    throw new Error("Function not implemented.");
}
