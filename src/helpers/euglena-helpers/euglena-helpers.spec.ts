import { createEuglena } from "./euglena-helpers";
import { defO } from "../organelle-helpers";
import { g3 } from "../gene-helpers";
import { ParticleV3, MetaV3Optionals, Particle } from "../../particle";
import { p, m3 } from "../particle-helpers";
import { GeneCluster } from "../../gene";
import { commonParticles } from "../common-particles";
import timer, { TimerDefaultExport } from "./organelles/timer";
import { sys } from "cessnalib";

const [timerOrganelleName, timerCreateOrganelle, timerCreateParticle, timerParticles]: TimerDefaultExport = timer;

// //organelles
// export namespace LoggerParticles {
//   export namespace outgoing {
//     export type Exception = ParticleV3<typeof loggerParticles.Exception, string>;
//   }

//   export namespace incoming {
//     export type Log = ParticleV3<typeof loggerParticles.Log, string>;
//   }
// }

// export type OutGoingLoggerParticle = LoggerParticles.outgoing.Exception;
// export type InComingLoggerParticle = LoggerParticles.incoming.Log;
// namespace loggerParticles {
//   export const Log: "Log" = "Log";
//   export const Exception: "Exception" = "Exception";
// }
// const loggerOrganelleName = "logger";
// function createLoggerIncomingParticle(name: typeof loggerParticles.Log, message: string, optionals?: MetaV3Optionals): LoggerParticles.incoming.Log;
// function createLoggerIncomingParticle(name: typeof loggerParticles[keyof typeof loggerParticles], ...remains: any): InComingLoggerParticle {
//   switch (name) {
//     case loggerParticles.Log:
//       const [message, optionals] = remains as [string, MetaV3Optionals];
//       return p(m3(name, optionals), message);
//   }
// }
// function createLoggerOutgoingParticle(name: typeof loggerParticles.Exception, message: string, optionals?: MetaV3Optionals): LoggerParticles.outgoing.Exception;
// function createLoggerOutgoingParticle(name: typeof loggerParticles[keyof typeof loggerParticles], ...remains: any): OutGoingLoggerParticle {
//   switch (name) {
//     case loggerParticles.Log:
//       const [message, optionals] = remains as [string, MetaV3Optionals];
//       return p(m3(name, optionals), message);
//   }
// }

// /** organelle definitions */
// const logger = defO(loggerOrganelleName, addReaction => {
//   addReaction(loggerParticles.Log, async (particle, { receive }) => {
//     console.log(`logging ${particle}`);
//     receive(createLoggerOutgoingParticle(loggerParticles.Exception, "No exception , just test")).subscribe(particle => {});
//   });
// });

const createOrganelles = {
  // logger: logger
};

//genes
const geneCluster: GeneCluster = [
  // g3(
  //   "When euglena has been born log a sentence",
  //   { meta: { name: commonParticles.EuglenaHasBeenBorn } },
  //   async (particle: commonParticles.EuglenaHasBeenBorn, sender, { receive, transmit }) => {
  //     transmit(loggerOrganelleName, createLoggerIncomingParticle(loggerParticles.Log, "Hello World"));
  //   }
  // )
  g3("Send Saps", { meta: { name: commonParticles.EuglenaHasBeenBorn } }, async (particle: commonParticles.EuglenaHasBeenBorn, sender, { transmit }) => {
    transmit(timerOrganelleName, timerCreateParticle(timerParticles.Sap, sys.type.StaticTools.Time.now()));
  })
];

//particles
const particles: Particle[] = [];

console.log(`createEuglena`);
createEuglena(createOrganelles, geneCluster, particles);
