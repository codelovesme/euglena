import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, MetaV3Optionals } from "../../../particle";
declare const organelleName: "logger";
export declare type LoggerDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createLoggerIncomingParticle, typeof loggerParticles>;
export declare namespace LoggerParticles {
    namespace outgoing {
        type Exception = ParticleV3<typeof loggerParticles.Exception, string>;
    }
    namespace incoming {
        type Log = ParticleV3<typeof loggerParticles.Log, string>;
    }
}
export declare type OutGoingLoggerParticle = LoggerParticles.outgoing.Exception;
export declare type InComingLoggerParticle = LoggerParticles.incoming.Log;
declare namespace loggerParticles {
    const Log: "Log";
    const Exception: "Exception";
}
declare function createLoggerIncomingParticle(name: typeof loggerParticles.Log, message: string, optionals?: MetaV3Optionals): LoggerParticles.incoming.Log;
/** organelle definitions */
declare const createOrganelle: CreateOrganelle;
declare const defaultExport: LoggerDefaultExport;
export default defaultExport;
