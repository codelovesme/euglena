import moment from "moment";
import { organelle, particle } from "@euglena/template";
import { dco, Particle } from "@euglena/core";

import common = particle.common;
import logger = organelle.logger;

export type Sap = particle.Particle<
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
