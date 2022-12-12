import { particle } from "@euglena/template";
import logger from "@euglena/organelle.logger.console";
import { organelles } from "../constants";

export default [
  particle.common.cp("OrganelleInfo", {
    name: organelles.logger,
    location: {
      type: "InMemory",
      organelle: logger,
    },
  }),
];
