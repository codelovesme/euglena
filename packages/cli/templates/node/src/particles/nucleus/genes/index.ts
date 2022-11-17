import { genes } from "@euglena/template";
import { name as vacuoleJsName } from "../../vacuole-js";
import { name as loggerConsoleName } from "../../logger-console";
import { name as nucleusJsName } from "..";
import * as printHelloWorld from "./print-hello-world";

export default [
  printHelloWorld.createGene({
    organelles: {
      logger: {
        name: loggerConsoleName
      },
      nucleus: nucleusJsName,
    },
    parameters: {},
  }),
  genes.log.createGene({
    organelles: {
      logger: loggerConsoleName,
      nucleus: nucleusJsName,
    },
    parameters: {},
  }),
  genes.vacuoleGetAlive.createGene({
    organelles: {
      vacuole: vacuoleJsName,
      nucleus: nucleusJsName,
    },
    parameters: {
      retry: false,
    },
  }),
];
