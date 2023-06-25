import * as cessnalib from "cessnalib";
import { Particle, cp } from "@euglena/core";
import { vacuole } from "../../store"
import { Exception } from "../../../../exception.par.h";
import { dcg } from "../../../../cell/genetics/gene.u";
import { Pulse } from "../pulse.par.h";
import { RemoveParticle } from "../../store/vacuole";

export type Unauthenticate = Particle<"Unauthenticate">;

export const createGeneUnauthenticate = dcg<
    Pulse<Unauthenticate>,
    {
        vacuole: vacuole.Vacuole;
    }
>(
    "Unauthenticate",
    { meta: { class: "Pulse" }, data: { particle: { meta: { class: "Unauthenticate" } } } },
    async (pulse, s, { t, o }) => {
        const sender = pulse.data.sender;
        if (!sender) return cp<Exception>("Exception", new cessnalib.sys.Exception("Sender euglena is empty! Not possible to unauthenticate."));

        const removeSession = cp<RemoveParticle>("RemoveParticle", {
            query: { meta: { class: "Session" }, data: { decryptedToken: { euglenaName: pulse.data.sender?.data.euglenaName } } },
            count: 1
        });
        return await t(removeSession, "vacuole");
    },
);
