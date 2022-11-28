import moment from "moment";
import { organelle, particle } from "@euglena/template";
import * as core from "@euglena/core";

import common = particle.common;
import logger = organelle.logger;
import Particle = core.particle.Particle;

const dco = core.organelle.dco;

export type Sap = Particle<
    "Sap",
    {
        test: boolean;
    }
>;

export default dco<logger.Logger, Sap>({
    Sap: async (particle) => {},
    Log: async (particle, { t }) => {
        console.log(`${particle.data.level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${particle.data.message}`);
        return common.cp("ACK");
    }
});
