import { ParticleV3 } from "../../particle";
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
export {};
