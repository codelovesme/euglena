import logger from "../organelles/logger";
import printHelloWorld from "./print-hello-world";
import log from "@euglena/gene.common.logging";

const organelles = {
    logger: logger.name
};

export default [printHelloWorld(organelles), log(organelles)];
