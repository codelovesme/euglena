import { MetaAdditions, Particle, Meta, cp } from "@euglena/particle";
import { sys } from "cessnalib";

export const createCommonParticle = {
    ACK: (adds?: MetaAdditions) => cp("ACK", undefined, adds),
    EuglenaName: (name: string, adds?: MetaAdditions) => cp("EuglenaName", name, adds),
    Exception: (message: string, innerException?: sys.type.Exception, adds?: MetaAdditions) =>
        cp("Exception", new sys.type.Exception(message, innerException), adds),
    Particles: (particlesArray: Particle[], adds?: MetaAdditions) => cp("Particles", particlesArray, adds),
    Metas: (metas: Meta[], adds?: MetaAdditions) => cp("Metas", metas, adds),
    NoReaction: (adds?: MetaAdditions) => cp("NoReaction", undefined, adds),
    InvalidParticle: (adds?: MetaAdditions) => cp("InvalidParticle", adds),
    Log: (message: string, level: "Info" | "Error" | "Warning", adds?: MetaAdditions) =>
        cp("Log", { message, level }, adds),
    Sap: <T>(organelle: { name: string; nick?: string }, data: T) => cp("Sap", data, { organelle })
};

export type CreateSap<T> = (
    organelle: { name: string; nick?: string },
    data: T
) => ReturnType<typeof createCommonParticle["Sap"]>;

/**
 * Alias for createCommonParticle
 */
export const ccp = createCommonParticle;
global;
