import moment from "moment";
import { logger } from "@euglena/template";
import { ccp, dco, Particle } from "@euglena/core";

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
        return ccp.ACK();
    }
});
