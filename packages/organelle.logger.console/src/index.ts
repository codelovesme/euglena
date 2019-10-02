import logger from "@euglena/organelle.logger";

export default logger.com({
  Log: async particle => {
    console.log(`${new Date()} ${particle.data.message}`);
  },
  Sap: async particle => {}
});
