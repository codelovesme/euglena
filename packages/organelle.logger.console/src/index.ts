import moment from "moment";
import { logger, Sap } from "@euglena/core";

export default logger.v1.com<
    Sap<{
        test: boolean;
    }>
>({
    Log: async (particle, { cp, t }) => {
        console.log(`${particle.data.level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${particle.data.message}`);
        t(cp.ACK());
    },
    Sap: async (particle) => {}
});
