import { name as loggerConsoleName } from "../../logger-console";
import { name as nucleusJsName } from "..";
import * as printHelloWorld from "./print-hello-world";
import log from "@euglena/gene.common.logging";

export default [
    printHelloWorld.createGene({
        organelles: {
            logger: {
                name: loggerConsoleName
            },
            nucleus: nucleusJsName
        },
        parameters: {}
    }),
    log({
        logger: loggerConsoleName
    })
];
