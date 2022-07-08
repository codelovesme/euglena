import moment from "moment";
import { Sap } from "@euglena/core";
import { logger } from "@euglena/template";

export default logger.v1.com<
    Sap<{
        test: boolean;
    }>
>({
    Log: async (particle, { cp, t }) => {
        console.log(`${particle.data.level} - ${moment().format("YYYY.MM.DD HH:mm:ss")} - ${particle.data.message}`);
        return cp.ACK();
    },
    Sap: async (particle) => {}
});
