import printHelloWorld from "./print-hello-world";
import log from "@euglena/gene.common.logging";

import { organelles } from "../constants";

export default [printHelloWorld(organelles), log(organelles)];
