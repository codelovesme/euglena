import { OrganelleDefaultExport, CreateOrganelle } from "../../../organelle";
import { ParticleV3, MetaV3Optionals, Meta } from "../../../particle";
import { p, m3 } from "../../particle-helpers";
import { defO } from "../../organelle-helpers";

const organelleName: "logger" = "logger";

export type LoggerDefaultExport = OrganelleDefaultExport<typeof organelleName, typeof createOrganelle, typeof createLoggerIncomingParticle, typeof loggerParticles>;
export namespace LoggerParticles {
  export namespace outgoing {
    export type Exception = ParticleV3<typeof loggerParticles.Exception, string>;
  }

  export namespace incoming {
    export type Log = ParticleV3<typeof loggerParticles.Log, string>;
  }
}

export type OutGoingLoggerParticle = LoggerParticles.outgoing.Exception;
export type InComingLoggerParticle = LoggerParticles.incoming.Log;
namespace loggerParticles {
  export const Log: "Log" = "Log";
  export const Exception: "Exception" = "Exception";
}
const loggerOrganelleName = "logger";
function createLoggerIncomingParticle(name: typeof loggerParticles.Log, message: string, optionals?: MetaV3Optionals): LoggerParticles.incoming.Log;
function createLoggerIncomingParticle(name: typeof loggerParticles[keyof typeof loggerParticles], ...remains: any): InComingLoggerParticle {
  switch (name) {
    case loggerParticles.Log:
      const [message, optionals] = remains as [string, MetaV3Optionals];
      return p(m3(name, optionals), message);
  }
}
function createLoggerOutgoingParticle(name: typeof loggerParticles.Exception, message: string, optionals?: MetaV3Optionals): LoggerParticles.outgoing.Exception;
function createLoggerOutgoingParticle(name: typeof loggerParticles[keyof typeof loggerParticles], ...remains: any): OutGoingLoggerParticle {
  switch (name) {
    case loggerParticles.Log:
      const [message, optionals] = remains as [string, MetaV3Optionals];
      return p(m3(name, optionals), message);
  }
}

/** organelle definitions */
const createOrganelle = defO(loggerOrganelleName, addReaction => {
  addReaction(loggerParticles.Log, async (particle, { receive }) => {
    console.log(`${new Date()} ${particle.data}`);
    receive(createLoggerOutgoingParticle(loggerParticles.Exception, "No exception , just test")).subscribe(particle => {});
  });
});

const defaultExport: LoggerDefaultExport = [organelleName, createOrganelle, createLoggerIncomingParticle, loggerParticles];
export default defaultExport;
