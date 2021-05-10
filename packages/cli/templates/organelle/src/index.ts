import { logger, Sap } from "@euglena/core";

export default logger.v1.com<
    Sap<{
        test: boolean;
    }>
>({
    Sap: async (particle) => {},
    Log: async (particle, { cp, t }) => {
        console.log(`${particle.data.level} - ${particle.data.message}`);
        t(cp.ACK());
    }
});
