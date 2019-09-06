import { createEuglena } from "./euglena";
import { sys } from "cessnalib";
import { createChromosome } from "./gene";
import { CommonParticleType } from "../template";
import { timer } from "../template/organelles/timer";
import { logger } from "../template/organelles/logger";

describe("", () => {
  test("", () => {
    createEuglena(
      {},
      createChromosome({ Logger: logger.cp }, g => {
        g<CommonParticleType<"EuglenaHasBeenBorn">>(
          "Send Saps",
          { meta: { name: "EuglenaHasBeenBorn" } },
          async (particle, sender, { t }) => {
            t(timer.n, timer.cp.incoming.TimerSetTime(sys.type.StaticTools.Time.now()));
          }
        );
        // g("Log seconds", { meta: { name: "" } }, async (particle, sender, {}) => {});
      })
    );
  });
});
