import { createEuglena } from "./euglena-helpers";
import { defO } from "../organelle-helpers";
import { g3, defG } from "../gene-helpers";
import { ParticleV3, MetaV3Optionals, Particle } from "../../particle";
import { p, m3, commonParticles } from "../particle-helpers";

//organelles
namespace LoggerParticles {
  export type Log = ParticleV3<typeof loggerParticles.Log, string>;
  export type LoggerParticle = Log;
}
namespace loggerParticles {
  export const Log: "Log" = "Log";
}
const loggerOrganelleName = "logger";
function createLoggerParticle(name: typeof loggerParticles.Log, message: string, optionals?: MetaV3Optionals): LoggerParticles.Log;
function createLoggerParticle(name: typeof loggerParticles[keyof typeof loggerParticles], ...remains: any): LoggerParticles.LoggerParticle {
  switch (name) {
    case loggerParticles.Log:
      const [message, optionals] = remains as [string, MetaV3Optionals];
      return p(m3(name, loggerOrganelleName, optionals), message);
  }
}
const logger = defO((addReaction, receive) => {
  addReaction(loggerParticles.Log, async particle => {
    console.log(particle);
  });
});

const createOrganelles = {
  logger: logger
};

//genes
const createGeneClusterArr = [
  defG((addGene, transmit, receive) => {
    addGene(
      g3("When euglena has been born log a sentence", { meta: { name: commonParticles.EuglenaHasBeenBorn } }, async (particle: commonParticles.EuglenaHasBeenBorn) => {
        transmit(loggerOrganelleName, createLoggerParticle(loggerParticles.Log, "Hello World"));
      })
    );
  })
];

//particles
const particles: Particle[] = [];

console.log(`createEuglena`);
createEuglena(createOrganelles, createGeneClusterArr, particles);
