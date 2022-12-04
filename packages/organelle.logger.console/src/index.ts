import moment from "moment";
import * as core from "@euglena/core";
import { organelle, particle } from "@euglena/template";

import common = particle.common;
import logger = organelle.logger;

export type Sap = particle.common.Sap;

export default core.organelle.dco<logger.Logger, Sap>({
    Sap: async (particle) => {},
    Log: async (particle, { t }) => {
        console.log(`${particle.data.level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${particle.data.message}`);
        return common.cp("ACK");
    }
});
