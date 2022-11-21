import { sys } from "cessnalib";
import { isParticleClass } from "@euglena/core";
import { particle, organelle } from "@euglena/template";
import { dcg } from "@euglena/organelle.nucleus.js";

import vacuole = organelle.vacuole;
import jwt = organelle.jwt;
import netServer = organelle.netServer;
import nucleus = organelle.nucleus;

import auth = particle.auth;
import common = particle.common;

import Impulse = netServer.Impulse;

/**
 * Checks if the token valid and session is there
 * Then returns user
 */
export default dcg<
    Impulse,
    {
        jwt: jwt.JWT;
        vacuole: vacuole.Vacuole;
        nucleus: nucleus.Nucleus;
    }
>("Authentication", { meta: { class: "Impulse" } }, async (p, s, { t, o }) => {
    const token = p.data.token;
    //Check if token exists
    if (!token) return common.cp("Exception", new sys.type.Exception("There is no token"));

    //Decode token and check if it fails
    const verifyTokenResult = await t(jwt.cp("VerifyToken", token), "jwt");
    if (isParticleClass(verifyTokenResult, "Exception")) return verifyTokenResult;

    // Fetch token from db (no need token anymore), if session doesn't exist then return error
    const readSession = vacuole.cp("ReadParticle", {
        query: {
            meta: { class: "Session" },
            data: { encryptedToken: token, decryptedToken: { euglenaName: verifyTokenResult.data.euglenaName } }
        },
        count: 1
    });
    const readSessionResult = (await t(readSession, "vacuole")) as common.Particles | common.Exception;
    if (isParticleClass(readSessionResult, "Exception")) return readSessionResult;
    const sessionParticle = readSessionResult.data[0] as auth.Session;

    //check if there is session
    if (!sessionParticle) return common.cp("Exception", new sys.type.Exception("Not Authenticated"));

    //Check if session expired
    if (sessionParticle.data.decryptedToken.expireAt < new Date().getTime())
        return common.cp("Exception", new sys.type.Exception("Authorization token is expired"));

    //Fetch user
    const fetchUser = vacuole.cp("ReadParticle", {
        count: 1,
        query: {
            meta: { class: "EuglenaInfo" },
            data: { euglenaName: sessionParticle.data.decryptedToken.euglenaName }
        }
    });
    const fetchUserResult = await t(fetchUser, "vacuole");
    if (isParticleClass(fetchUserResult, "Exception")) return fetchUserResult;
    const userParticle = fetchUserResult.data[0] as auth.EuglenaInfo;
    if (!userParticle)
        return common.cp("Exception", new sys.type.Exception("There is no user related with this token"));

    //check user is active
    if (userParticle.data.status !== "Active")
        return common.cp("Exception", new sys.type.Exception("User is not active"));

    //throw authenticated impulse
    const authenticatedImpulse = auth.cp("AuthenticatedImpulse", {
        particle: p.data.particle,
        sender: userParticle
    });
    const nucleusParticleReceive = nucleus.cp("ReceiveParticle", {
        particle: authenticatedImpulse,
        source: o.nucleus
    });
    return await t(nucleusParticleReceive, "nucleus");
});
