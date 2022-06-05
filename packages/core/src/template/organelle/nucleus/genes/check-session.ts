import { sys } from "cessnalib";
import { Particle } from "../../../../particle";
import { DecryptedToken, Exception } from "../../../particle";
import { dg, Organelles } from "../../nucleus";

export type CheckSession = Particle<"CheckSession", string>;

export interface CheckSessionOrganelles extends Organelles {
    organelleJWT: string;
    organelleVacuoleDB: string;
}

export const createCheckSessionGene = dg<CheckSession, CheckSessionOrganelles>(
    "Check session",
    { meta: { class: "CheckSession" } },
    async ({ data: token }, s, { to, template, particle }) => {
        const { vacuole, ccp, jwt } = template;
        const { isParticleClass } = particle;

        //Check if token exists
        if (!token) return ccp.Exception(new sys.type.Exception("There is no token"));

        //Decode token and check if it fails
        const verifyTokenResult = (await to.organelleJWT(jwt.v1.cp.VerifyToken(token))) as DecryptedToken | Exception;
        if (isParticleClass(verifyTokenResult, "Exception")) return verifyTokenResult;

        // Fetch token from db (no need token anymore), if session doesn't exist then return error
        const readSession = vacuole.v1.cp.ReadParticle({
            query: {
                meta: { class: "Session" },
                data: { encryptedToken: token, decryptedToken: { euglenaName: verifyTokenResult.data.euglenaName } }
            },
            count: 1
        });
        const readSessionResult = await to.organelleVacuoleDB(readSession) as Particle;
        if(isParticleClass(readSessionResult,"Exception")) return readSessionResult;


        return readSessionResult;
    }
);
