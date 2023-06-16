import printHelloWorld from "./print-hello-world";
import {sys} from "@euglena/template";

import { organelles } from "../constants";

export default [printHelloWorld(organelles), sys.log.createGeneLog(organelles)];
