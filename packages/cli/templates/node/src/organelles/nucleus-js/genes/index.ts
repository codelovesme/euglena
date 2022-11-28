import { name as loggerConsoleName } from "../../logger-console";
import printHelloWorld from "./print-hello-world";
import log from "@euglena/gene.common.logging";

const organelles = {
    logger: loggerConsoleName
};

export default [printHelloWorld(organelles), log(organelles)];
